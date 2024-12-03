import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Убедитесь, что URL корректен

export const calculateRoute = async (cities, clusters) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/routes/final-optimize/${clusters}`, cities);
        return response.data; // Возвращает оптимизированный маршрут и общее расстояние
    } catch (error) {
        console.error('Ошибка при расчете маршрута:', error);
        return null;
    }
};
