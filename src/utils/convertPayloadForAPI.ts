import { format, addMinutes } from 'date-fns';

const convertPayloadForAPI = (selectedDates) => {
    return selectedDates
    .map((slot) => {
      const dateStr = format(slot.date, 'yyyy-MM-dd');
      
      return slot.times.map((time) => {
        const startDateTime = new Date(`${dateStr}T${time.start}:00.000Z`);
        const durationMinutes = parseInt(time.duration.split(":")[0]) * 60 + parseInt(time.duration.split(":")[1]);
        const endDateTime = addMinutes(startDateTime, durationMinutes);

        return {
          date: startDateTime.toISOString(),
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        };
      });
    })
    .flat();
};

export default convertPayloadForAPI;