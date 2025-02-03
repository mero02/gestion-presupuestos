import axios from 'axios';

const API_KEY = '7036849b39e7f649d0ef23e769d5bbff';
const BASE_URL = 'https://api.exchangeratesapi.io/latest';

export const obtenerTasaCambio = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        symbols: 'ARS,USD,EUR', // Agrega más monedas si lo necesitas
      },
    });
    return response.data.rates;
  } catch (error) {
    console.error('Error obteniendo tasas de cambio:', error);
    return null;
  }
};
