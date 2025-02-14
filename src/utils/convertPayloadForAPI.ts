import { format, addMinutes } from 'date-fns';

const convertPayloadForAPI = (selectedDates) => {
    return selectedDates
    .map((slot) => {
      const dateStr = format(slot.date, 'yyyy-MM-dd'); // Converte para string YYYY-MM-DD
      
      return slot.times.map((time) => {
        const startDateTime = new Date(`${dateStr}T${time.start}:00.000Z`); // Cria objeto Date do início
        const durationMinutes = parseInt(time.duration.split(":")[0]) * 60 + parseInt(time.duration.split(":")[1]); // Converte duração para minutos
        const endDateTime = addMinutes(startDateTime, durationMinutes); // Calcula o horário de término

        return {
          date: startDateTime.toISOString(), // Data formatada em ISO
          start: startDateTime.toISOString(), // Início da reunião
          end: endDateTime.toISOString(), // Término da reunião
        };
      });
    })
    .flat(); // Transforma array de arrays em um único array
};

export default convertPayloadForAPI;