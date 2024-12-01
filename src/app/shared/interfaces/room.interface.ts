import { ReviewInterface } from './review.interface';

export interface RoomInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  reviews: ReviewInterface[];
  maxOccupancy: number;
  fullDescription: string;
  roomId: number;
  staticFeatures: Record<string, boolean>; // Key-value pairs where values are boolean
  dynamicFeatures: Record<string, boolean>; // Key-value pairs where values are boolean
  startDate: Date;
  endDate: Date;
  averageRating: number;

  availableRoomsCount?: number;
}
