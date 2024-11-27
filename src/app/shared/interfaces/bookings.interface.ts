export interface BookingsInterface {
  bookingId: number;
  startDate: Date;
  endDate: Date;
  numOfPeople: number;
  totalPrice: number;
  roomTitle: string;
  description: string;
  image: string;
  isExpired: boolean;
}
