export interface Order {
    orderId: string;
    buyerId: string;
    sellerId: string;
    itemId: string;
    transactionId: string;
    totalAmount: number;
    formData: string;
    status: OrderStatus;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    SHIPPED = 'SHIPPED',
    NOT_PAYED = 'NOT PAYED',
    HIDDEN = 'HIDDEN',
}
