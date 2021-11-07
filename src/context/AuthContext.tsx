import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from "../api/cafeApi";
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/AppInterfaces';
import { AuthReducer, AuthState } from './AuthReducer';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'no-authenticated';
    singIn: ( loginData: LoginData) => void;
    singUp: ( registerData: RegisterData) => void;
    logOut: () => void;
    removeError: () => void;

}

const authInitialState: AuthState = {
    errorMessage: '',
    token: null,
    user: null,
    status: 'checking'
}

export const AuthContext =  createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: {children: JSX.Element | JSX.Element[]}) => {

    const [state, dispatch] = useReducer(AuthReducer, authInitialState);


    useEffect(() => {
        checkToken();
    }, []);


    const checkToken = async() => {
        const token = await AsyncStorage.getItem('tokenProdApp');

        //No hay token
        if (!token) {
            return dispatch({type: 'no-authenticated'});
        }

        const { data, status } = await cafeApi.get('/auth');

        if (status !== 200) {
            return dispatch({ type: 'no-authenticated'});
        }

        dispatch({
            type: 'singUp',
            payload: {
                token: data.token,
                user: data.usuario
            }
        });
    }

    const singIn = async({ correo, password}: LoginData) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'singUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('tokenProdApp', data.token);
            
        } catch (error: any) {
            dispatch({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Información incorrecta'
            });
        }
    };

    const singUp = async ({ nombre, correo, password }: RegisterData) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { nombre, correo, password });
            dispatch({
                type: 'singUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('tokenProdApp', data.token);
            
        } catch (error: any) {            
            dispatch({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'El correo ya esta registrado'
            });
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('tokenProdApp');
        dispatch({type: 'logout'});
    };

    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                singUp,
                singIn,
                logOut,
                removeError
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}