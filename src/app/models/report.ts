import { Order } from "./order";

export interface Report {
  id: number;
  orderData: Order[];
  orderIds: number[];
}
