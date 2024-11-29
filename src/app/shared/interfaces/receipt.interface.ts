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
  featureNames: string;
  featurePrices: string;
  pricePerNight: number;

  isReviewed: boolean;
  review: ReviewInterface;
  isExpired: boolean;
}
