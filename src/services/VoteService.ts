import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { PostVoteProps } from '@/types/room';

export async function postVote(voteData: PostVoteProps) {
  const vote = {
    userName: voteData.name,
    email: voteData.email,
    times: voteData.timeSlots,
  };
  try {
    const response = await axios.post(`${BASE_URL}/api/vote`, vote);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar voto:', error);
    throw error;
  }
}
