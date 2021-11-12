import React, { createContext, useEffect, useState } from "react";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from '../interfaces/AppInterfaces';

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    lazyLoad: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    loadProductById: (productId: string) => Promise<Producto>;
    uploadImageProduct: (data: any, productId: string) => Promise<void> //TODO: Cambiar tipado de data
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

    const deleteProduct = async (productId: string) => {
        console.log('updateProduct');
        console.log({ productId });
    }

    const loadProductById = async (productId: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${productId}`);
        return resp.data;
    }
    
    const uploadImageProduct = async (data: any, productId: string) => {}

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