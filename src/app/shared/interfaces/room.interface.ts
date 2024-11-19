export interface RoomInterface {
  id: number;
  description: string;
  price: number;
  image: string;
  rating: number;
  maxOccupancy: number;
  fullDescription: string;
  roomId: number;
  staticFeatures: Record<string, boolean>; // Key-value pairs where values are boolean
  dynamicFeatures: Record<string, boolean>; // Key-value pairs where values are boolean
  startDate: Date;
  endDate: Date;
}
