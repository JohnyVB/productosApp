import { Usuario } from '../interfaces/AppInterfaces';

export interface AuthState {
    status: 'checking' | 'authenticated' | 'no-authenticated';
    token: string | null;
    errorMessage: string;
    user: Usuario | null;
}

type AuthAction = 
    | { type: 'singUp', payload: {token: string, user: Usuario} }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'no-authenticated' }
    | { type: 'logout' }


export const AuthReducer = ( state: AuthState, action: AuthAction): AuthState => {

    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'no-authenticated',
                token: null,
                errorMessage: action.payload
            }

        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            }

        case 'singUp': 
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user
            }


        case 'logout':
        case 'no-authenticated':
            return {
                ...state,
                status: 'no-authenticated',
                token: null,
                user: null
            }

        default:
            return state;
    }

    
}