export type PostVoteProps = {
  roomId: string;
  votes: {
    userId: string;
    choice: string;
  }[];
};

export type TimeSlot = {
  dateTime: string;
  duration: string;
  votes: Vote[];
};

export type Vote = {
  name: string;
  email?: string;
  timeSlots: string[];
};
