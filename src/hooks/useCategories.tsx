import { useEffect, useState } from "react";
import cafeApi from "../api/cafeApi";
import { CategoriesResponse, Categoria } from '../interfaces/AppInterfaces';


export const useCategories = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setcategories] = useState<Categoria[]>([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const resp = await cafeApi.get<CategoriesResponse>('/categorias');
        setcategories(resp.data.categorias);
        setIsLoading(false);
    }


    return {
        categories,
        isLoading
    }
}
