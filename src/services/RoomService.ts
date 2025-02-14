import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { format } from 'date-fns';
import convertPayloadForAPI from '@/utils/convertPayloadForAPI';
import { postRoomProps } from '@/types/room';

export async function getRoom(idRoom: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/room/${idRoom}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    throw error;
  }
}

export async function postRoom(roomData: postRoomProps) {
  const endingAt = new Date(`${format(roomData.endDate, 'yyyy-MM-dd')}T${roomData.endTime}:00.000Z`).toISOString();
  const selectedDtates = convertPayloadForAPI(roomData.selectedDates);

  const room = {
    name: roomData.name,
    title: roomData.title,
    description: roomData.description,
    endingAt: endingAt,
    times: selectedDtates,
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/room/`, room);
    return response.data.roomId;
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
}
