
import { cartItems } from "./shared/schema";

type InsertCartItem = typeof cartItems.$inferInsert;

const item: InsertCartItem = {
    sessionId: "123",
    serviceId: "456",
    qty: 2
};

console.log("Item created:", item);
