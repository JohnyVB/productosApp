import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const ProtectedScreen = () => {

    const { user, token, logOut } = useContext(AuthContext);

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>Protected Screen</Text>

            <Text>
                { JSON.stringify(user, null, 5)}
            </Text>

            <Text>
                { JSON.stringify({token}, null, 5)}
            </Text>

            <Button 
                title="logout"
                onPress={logOut}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50
    },

    title: {
        fontSize: 20,
        marginBottom: 20
    }
});