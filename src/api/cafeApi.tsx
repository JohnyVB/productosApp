import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://back-end-cafe.herokuapp.com/api';

const cafeApi = axios.create({baseURL});

cafeApi.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('tokenProdApp');

        if (token) {
            config.headers['x-token'] = token;
        }

        return config;
    }
);

export default cafeApi;