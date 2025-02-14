import { RoomAPIResponse } from "@/types/room";

const convertTimeSlotsToUUIDs = (timeSlots: string[], room: RoomAPIResponse): string[] => {
  if (!room || !room.Time) return [];

  return timeSlots
    .map((selectedTime) => {
      const matchedTime = room.Time.find((slot) => slot.start === selectedTime);
      return matchedTime ? matchedTime.timeId : null;
    })
    .filter((uuid): uuid is string => uuid !== null);
};

export default convertTimeSlotsToUUIDs;
