export type RoomAPIResponse = {
  id: string;
  name: string;
  createdAt: string;
};

export type Room = {
  id: string;
  name: string;
  members: string[];
};

export type postRoomProps = {
  name: string;
  title: string;
  description: string;
  endDate: string;
  endTime: string;
  selectedDates: {
    date: string;
    time: {
      start: string;
      end: string;
    }[];
  };
};

export type PostVoteProps = {
  name: string;
  email?: string;
  timeSlots: string[];
};
