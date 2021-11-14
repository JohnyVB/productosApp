import React, { createContext, useEffect, useState } from "react";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from '../interfaces/AppInterfaces';
import { ImagePickerResponse } from 'react-native-image-picker';

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    lazyLoad: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    loadProductById: (productId: string) => Promise<Producto>;
    uploadImageProduct: (data: ImagePickerResponse, productId: string) => Promise<void> 
}


export const ProductsContext = createContext({} as ProductsContextProps);

interface PropsProvider {
    children: JSX.Element | JSX.Element[];
}

export const ProductsProvider = ({children}: PropsProvider) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const lazyLoad = async () => {
        try {
            const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
            setProducts([ ...resp.data.productos]);
        } catch (error: any) {
            console.log(error.response.data.errors[0].msg); 
        }
    }

    const loadProducts = async () => {

        try {
            const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
            setProducts([...products, ...resp.data.productos]);
        } catch (error: any) {
            console.log(error.response.data.errors[0].msg); 
        }

    }

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId
        });
        setProducts([ ...products, resp.data ]);

        return resp.data;
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId
        });
        setProducts(products.map( prod => {
            return (prod._id === productId)
                        ? resp.data
                        : prod
        }));
    }

    
    const loadProductById = async (productId: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${productId}`);
        return resp.data;
    }

    const uploadImageProduct = async ( { assets }: any, productId: string) => {
        const fileToUpload = {
            uri: assets[0].uri,
            type: assets[0].type,
            name: assets[0].fileName
        }
        
        const formdata = new FormData();
        formdata.append('archivo', fileToUpload);

        try {
            await cafeApi.put(`/uploads/productos/${productId}`, formdata);
        } catch (error) {
            console.log({error});  
        }
    }
    
    const deleteProduct = async (productId: string) => {
        console.log('updateProduct');
        console.log({ productId });
    }


    return (
        <ProductsContext.Provider
            value={{
                products,
                loadProducts,
                lazyLoad,
                addProduct,
                updateProduct,
                deleteProduct,
                loadProductById,
                uploadImageProduct
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}