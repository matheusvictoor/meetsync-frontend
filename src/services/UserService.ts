import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export async function postUser(user: { name: string; email?: string }) {
  try {
    const response = await axios.post(`${BASE_URL}/api/users`, user);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
}
