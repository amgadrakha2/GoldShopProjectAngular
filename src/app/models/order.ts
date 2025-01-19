import { Client } from "./client";
import { Item } from "./item";

export interface Order {
  id: number;
  client: Client;
  orderType: string;
  totalWeight?: number;
  totalPrice?: number;
  time?: string; // Use ISO 8601 format (HH:mm:ss)
  date?: string; // Use ISO 8601 format (YYYY-MM-DD)
  previousReceiptNumber: string;
  employeeName: string;
  delay:number;
  items: Item[];
}
