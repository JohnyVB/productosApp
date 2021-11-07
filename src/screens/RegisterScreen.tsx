import React, { useContext, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LogoReact } from '../components/LogoReact';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {};

export const RegisterScreen = ({ navigation }: Props) => {

    const { singUp, errorMessage, removeError } = useContext(AuthContext);

    const { name, email, password, onChange } = useForm({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if( errorMessage.length === 0 ) return;

        Alert.alert(
            'Registro incorrecto', 
            errorMessage,
            [
                {
                    text: 'Ok',
                    onPress: removeError
                }
            ]
            
        );
    }, [errorMessage])

    const onRegister = () => {
        singUp({
            nombre: name,
            correo: email,
            password
        });
        Keyboard.dismiss();
    }

    return (
        <>

            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6'}}
                behavior={
                    (Platform.OS === 'ios')
                        ? 'padding'
                        : 'height'
                }
            >
                <View style={loginStyles.formContainer}>

                    <LogoReact />

                    {/* title */}
                    <Text style={loginStyles.title}>
                        Registro
                    </Text>

                    {/* name input */}
                    <Text style={loginStyles.label}>
                        Nombre
                    </Text>

                    <TextInput 
                        placeholder="Ingrese su nombre"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        
                        onChangeText={ (value) => onChange(value, 'name') }
                        value={ name }
                        onSubmitEditing={ onRegister }
                        autoCapitalize="words"
                    />


                    {/* email input */}
                    <Text style={loginStyles.label}>
                        Email
                    </Text>

                    <TextInput 
                        placeholder="Ingrese su email"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        
                        onChangeText={ (value) => onChange(value, 'email') }
                        value={ email }
                        onSubmitEditing={ onRegister }

                        autoCapitalize="none"
                        autoCorrect={false}
                    />


                    {/* password input */}
                    <Text style={loginStyles.label}>
                        Contraseña
                    </Text>

                    <TextInput 
                        placeholder="***********"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"

                        onChangeText={ (value) => onChange(value, 'password') }
                        value={ password }
                        onSubmitEditing={ onRegister }

                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={ onRegister }
                        >
                            <Text style={loginStyles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>

                   
                    <TouchableOpacity
                        onPress={ () => navigation.replace('LoginScreen') }
                        activeOpacity={0.8}
                        style={loginStyles.buttonReturn}
                    >
                        <Text style={{ ...loginStyles.buttonText, color: '#5856D6'}}>Ir al login</Text>
                    </TouchableOpacity>
                 
                </View>
            </KeyboardAvoidingView>


        </>
    )
}