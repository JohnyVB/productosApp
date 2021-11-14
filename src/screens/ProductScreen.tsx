import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProductsStackProps } from '../navigator/ProductsNavigator';
import { Picker } from '@react-native-picker/picker';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';


interface Props extends StackScreenProps<ProductsStackProps, 'ProductScreen'>{};

export const ProductScreen = ({route, navigation}: Props) => {

    const { id = '', name = '' } = route.params;

    const [temUri, setTemUri] = useState<string>()

    const { categories, isLoading } = useCategories();
    const { loadProductById, addProduct, updateProduct, uploadImageProduct } = useContext(ProductsContext);

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    });

    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Nombre del producto'
        });
    }, [nombre]);

    useEffect(() => {
        loadProduct();
    }, [])

    const loadProduct = async () => {
        if (id.length === 0) return;
        const productLoaded = await loadProductById(id);
        setFormValue({
            _id: id,
            categoriaId: productLoaded.categoria._id,
            img: productLoaded.img || '',
            nombre
        });
    }

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            //Actualizar
            updateProduct( categoriaId, nombre, id);

        } else {
            //Crear
            const temCategoryId = categoriaId || categories[0]._id;
            const newProduct = await addProduct( temCategoryId, nombre );
            onChange(newProduct._id, '_id');
        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        }, (resp: any) =>{

            if( resp.didCancel) return;
            if(!resp.assets[0].uri) return;

            setTemUri(resp.assets[0].uri);
            uploadImageProduct(resp, _id);
        });
    }

    const openGalery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        }, (resp: any) =>{

            if( resp.didCancel) return;
            if(!resp.assets[0].uri) return;

            setTemUri(resp.assets[0].uri);
            uploadImageProduct(resp, _id);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto: </Text>
                <TextInput 
                    placeholder="Producto"
                    style={styles.textInput}

                    value={nombre}
                    onChangeText={ (value) => onChange(value, 'nombre') }
                />

                {/* Selector */}
                <Text style={styles.label}>Categoria:</Text>

                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(itemValue) =>
                        onChange(itemValue, 'categoriaId')
                }>  
                    {
                        (isLoading)
                            ? <Picker.Item label="Cargando..." />
                            : categories.map( c => (
                                <Picker.Item label={ c.nombre } value={ c._id } key={ c._id } />
                            ))
                    }
                    
                </Picker>


                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btn}
                    onPress={ saveOrUpdate }
                >
                    <Text style={styles.btnText}>Guardar</Text>
                </TouchableOpacity>

                {
                    (_id.length > 0)
                        && (
                            <View style={styles.btnContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btn}
                                    onPress={ takePhoto }
                                >
                                    <Text style={styles.btnText}>Cámara</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btn}
                                    onPress={ openGalery }
                                >
                                    <Text style={styles.btnText}>Galería</Text>
                                </TouchableOpacity>
                            </View>
                        )
                }


                {
                    (img.length > 0 && !temUri)
                        && (
                            <Image 
                                source={{ uri: img }}
                                style={{ width: '100%', height: 300 }}
                            />
                        )
                }

                {
                    (temUri)
                        && (
                            <Image 
                                source={{ uri: temUri }}
                                style={{ width: '100%', height: 300 }}
                            />
                        )
                }

                


                

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    btn: {
        backgroundColor: '#5856D6',
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        alignItems:'center',
        marginVertical: 15,
        paddingHorizontal: 20
    },
    btnText: {
        color: 'white',
        fontSize: 18
    }
});
