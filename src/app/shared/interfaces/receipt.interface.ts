import { ReviewInterface } from './review.interface';

export interface Receipt {
  bookingId: number;
  startDate: Date;
  endDate: Date;
  numOfPeople: number;
  totalPrice: number;
  roomNum: string;
  roomTitle: string;
  description: string;
  image: string;
  featureNames: string | null;
  featurePrices: string | null;
  pricePerNight: number;
  basePrice: number;

  isReviewed: boolean;
  review: ReviewInterface | null;
  isExpired: boolean;
}
