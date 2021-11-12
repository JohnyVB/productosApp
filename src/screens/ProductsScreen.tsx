import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackProps } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackProps, 'ProductsScreen'>{};

export const ProductsScreen = ({ navigation }: Props) => {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const {products, lazyLoad} = useContext(ProductsContext);

    useEffect(() => {
       navigation.setOptions({
           headerRight: () => (
               <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ marginRight: 15}}
                    onPress={ () => navigation.navigate('ProductScreen', {})}
               >
                   <Text>Agregar</Text>
               </TouchableOpacity>
           )
       });
    }, []);

    const lazyLoadHandle = async () => {
        setIsRefreshing(true);
        await lazyLoad();
        setIsRefreshing(false);
    }

    return (
        <View
            style={{
                flex: 1,
                marginHorizontal: 10
            }}
        >
            <FlatList 
                data={products}
                keyExtractor={ (item) => item._id }

                renderItem={
                    ({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={ 
                                () => navigation.navigate('ProductScreen', {
                                    id: item._id,
                                    name: item.nombre
                                })
                            }
                        >
                            <Text style={styles.productName}>{ item.nombre }</Text>
                        </TouchableOpacity>
                    )
                }

                ItemSeparatorComponent={ () => (
                    <View style={styles.itemSeparator} />
                )}

                refreshControl={
                    <RefreshControl 
                        refreshing={ isRefreshing }
                        onRefresh={ lazyLoadHandle }
                    />
                }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    productName: {
        fontSize: 20
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    }
});