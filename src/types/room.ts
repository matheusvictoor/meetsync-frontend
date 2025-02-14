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

export type  RoomAPIResponse = {
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
