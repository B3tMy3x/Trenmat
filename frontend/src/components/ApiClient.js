// ApiClient.js
import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Убедитесь, что ваш базовый URL правильный
});

export default ApiClient; // Экспорт по умолчанию
