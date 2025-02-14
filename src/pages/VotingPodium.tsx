import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface Vote {
  name: string;
}

interface TimeSlot {
  dateTime: string;
  duration: string;
  votes: Vote[];
}

interface VotingPodiumProps {
  timeSlots: TimeSlot[];
  onShowVoters: (slot: TimeSlot) => void;
}

const VotingPodium = ({ timeSlots, onShowVoters }: VotingPodiumProps) => {
  return (
    <Card className="relative w-full mx-auto p-4 sm:p-6">
      <div className="absolute left-0 w-full h-full">
        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-pulse left-10" />
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full animate-pulse left-1/2" />
        <div className="absolute w-3 h-3 bg-orange-400 rounded-full animate-pulse right-10" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-sm sm:text-md md:text-2xl font-bold text-center mt-4 sm:mt-6">🏆 Pódio Atual dos 5 Horários Mais Votados</h2>
        <p className="text-muted-foreground text-xs sm:text-sm text-center">(Resultado oficial será mostrado após o término da votação)</p>
      </div>
      {timeSlots.filter((slot) => slot.votes.length > 0).length > 0 ? (
        <div className="relative flex justify-center items-end space-x-2 sm:space-x-4 pb-4 sm:pb-6 pt-16 sm:pt-20">
          <div className="absolute bottom-0 w-full h-4 sm:h-8 bg-gray-700 rounded"></div>
          {(() => {
            const votedSlots = timeSlots
              .filter((slot) => slot.votes.length > 0)
              .sort((a, b) => b.votes.length - a.votes.length)
              .slice(0, 5);
            const podiumOrder = [3, 1, 0, 2, 4];
            const podiumStyles = [
              'bg-green-400 text-white h-12 sm:h-24',
              'bg-gray-300 text-black h-16 sm:h-32',
              'bg-yellow-400 text-black h-20 sm:h-40',
              'bg-orange-400 text-black h-14 sm:h-28',
              'bg-blue-400 text-white h-10 sm:h-20',
            ];
            return podiumOrder.map((podiumIndex, index) => {
              const slot = votedSlots[podiumIndex];
              if (!slot) return null;

              const rankMap = new Map();
              let currentRank = 0;

              votedSlots.forEach((slot) => {
                const votes = slot.votes.length;

                if (!rankMap.has(votes)) {
                  rankMap.set(votes, currentRank);
                  currentRank++;
                }
              });

              const rank = rankMap.get(slot.votes.length);
              const styleIndex = Math.min(index, podiumStyles.length - 1);
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      key={slot.dateTime}
                      className={`relative flex flex-col items-center rounded-lg px-2 sm:px-4 py-2 sm:py-4 shadow-xl transition-all hover:scale-110 cursor-pointer ${podiumStyles[styleIndex]}`}
                      onClick={() => onShowVoters(slot)}
                    >
                      <span className="hidden sm:absolute sm:block sm:top-[-20px] bg-white border-2 text-black font-bold px-3 py-1 rounded-full shadow-md text-xs sm:text-sm">
                        {rank + 1}º 🏅
                      </span>
                      <p className="font-bold text-[10px] sm:text-md">{slot.dateTime ? format(new Date(slot.dateTime), 'dd/MM') : 'N/A'}</p>
                      <p className="text-[10px] sm:text-xs">
                        {slot.dateTime ? format(new Date(slot.dateTime), 'HH:mm') : 'N/A'}{' '}
                        <span className="hidden sm:inline">- {slot.duration || 'N/A'} min</span>
                      </p>
                      <p className="hidden sm:block text-xs sm:text-md font-semibold mt-2">{slot.votes ? slot.votes.length : 0} voto(s)</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique para visualizar os votantes</p>
                  </TooltipContent>
                </Tooltip>
              );
            });
          })()}
        </div>
      ) : (
        <p className="text-sm flex justify-center items-center text-muted-foreground py-12 sm:py-20">
          Nenhum horário votado até o momento.
          <Clock className="w-4 h-4 ml-2" />
        </p>
      )}
    </Card>
  );
};

export default VotingPodium;
