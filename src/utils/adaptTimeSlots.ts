import { toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

interface Vote {
  name: string;
  email?: string;
  timeSlots: string[];
}

interface TimeSlot {
  dateTime: string;
  duration: string;
  votes: Vote[];
}

type RoomAPIResponse = {
  roomId: string;
  title?: string;
  description?: string;
  emails: string[];
  endingAt: string;
  createdAt: string;
  updatedAt: string;
  Time: {
    roomId: string;
    timeId: string;
    date: string;
    start: string;
    end: string;
    Vote: {
      voteId: string;
      createdAt: string;
      userName: string;
      timeId: string;
    }[];
  }[];
};

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
