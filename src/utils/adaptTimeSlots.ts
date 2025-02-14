import { toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { RoomAPIResponse } from '@/types/room';
import { TimeSlot } from '@/types/vote';

export default function adaptTimeSlots(apiRoom: RoomAPIResponse): TimeSlot[] {
  return apiRoom.Time.map((time) => {
    const zonedStart = toZonedTime(parseISO(time.start), 'America/Sao_Paulo');
    const startTime = time.start.substring(11, 16);
    const endTime = time.end.substring(11, 16);
    const duration = `${startTime} - ${endTime}`;

    return {
      dateTime: zonedStart.toISOString(),
      duration,
      votes: time.Vote.map((vote) => ({
        name: vote.userName,
        timeSlots: [time.timeId],
      })),
    };
  });
}
