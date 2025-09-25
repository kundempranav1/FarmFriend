
import { Timestamp } from "firebase/firestore";

export interface CropForSale {
  id: string;
  userId: string;
  cropName: string;
  quantity: number;
  price: number;
  status: 'available' | 'sold';
  listedAt: Timestamp;
  imageUrl?: string;
}
