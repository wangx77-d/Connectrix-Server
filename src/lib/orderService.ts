import axios from 'axios';
import { Order, OrderStatus } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';
import { updateUser } from '@/lib/userService';

export async function createOrder(data: {
    buyerId: string;
    sellerId: string;
    itemId: string;
    totalAmount: number;
    status?: OrderStatus;
    formData?: string;
    transactionId?: string;
}): Promise<Partial<Order>> {
    const orderId = uuidv4().toString();

    const recordData = {
        orderId,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        itemId: data.itemId,
        totalAmount: data.totalAmount,
        status:
            data.status && data.transactionId
                ? OrderStatus.PENDING
                : OrderStatus.NOT_PAYED,
        formData: data.formData ?? '',
        transactionId: data.transactionId ?? '',
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    };

    const createRecordResponse = await axios.post(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: process.env.DB_TABLE_NAME_ORDERS || 'Orders-demo',
            data: recordData,
        }
    );

    const partialOrder: Partial<Order> = {
        orderId,
        itemId: recordData.itemId,
    };

    await updateUser(data.buyerId, {
        listOfSellingOrders: [partialOrder],
    });

    return createRecordResponse.data.data || null;
}

export async function getOrdersByUserId(
    userId: string,
    isBuyer: boolean
): Promise<Order[]> {
    const keyConditionExpression = isBuyer
        ? 'buyerId = :buyerId'
        : 'sellerId = :sellerId';
    const expressionAttributeValues = isBuyer
        ? {
              ':buyerId': userId,
          }
        : {
              ':sellerId': userId,
          };

    console.log('Request Body:', {
        tableName: process.env.DB_TABLE_NAME_ORDERS || 'Orders-demo',
        keyConditionExpression,
        expressionAttributeValues,
    });

    const orders = await axios.post(process.env.DB_RECORDS_API_URL + '/query', {
        tableName: process.env.DB_TABLE_NAME_ORDERS || 'Orders-demo',
        keyConditionExpression,
        expressionAttributeValues,
        indexName: 'SellerIdIndex',
    });
    return orders.data.data || null;
}

export async function getOrderById(
    orderId: string,
    userId: string,
    isOrderOnly?: boolean,
    isBuyer?: boolean
): Promise<Order | null> {
    const key = isOrderOnly
        ? {
              orderId,
          }
        : isBuyer
        ? { buyerId: userId, orderId }
        : { sellerId: userId, orderId };
    const order = await axios.post(
        process.env.DB_RECORDS_API_URL + '/retrieveRecord',
        {
            tableName: process.env.DB_TABLE_NAME_ORDERS || 'Orders-demo',
            key,
        }
    );
    return order.data.data || null;
}

export async function updateOrder(
    orderId: string,
    updates: Partial<Order>
): Promise<Order | null> {
    const updateData = {
        ...updates,
        updatedAt: Date.now().toString(),
    };

    const updateResponse = await axios.put(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: process.env.DB_TABLE_NAME_ORDERS || 'Orders-demo',
            key: { orderId },
            data: updateData,
        }
    );

    return updateResponse.data.data || null;
}
