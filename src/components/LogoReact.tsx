import React from 'react';
import { Image, View } from 'react-native';

export const LogoReact = () => {
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Image 
                source={ require('../assets/images/react-logo-white.png')}
                style={{
                    width: 110,
                    height: 100
                }}

            />
        </View>
    )
}
