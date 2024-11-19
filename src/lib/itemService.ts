import axios from 'axios';
import { Category, Item, Status } from '@/types/Item';
import { v4 as uuidv4 } from 'uuid';
import { updateUser } from '@/lib/userService';

export async function getItemByItemId(itemId: string): Promise<Item | null> {
    const item = await axios.post(
        process.env.DB_RECORDS_API_URL + '/retrieveRecord',
        {
            tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
            key: {
                itemId: itemId,
            },
        }
    );

    return item.data.data || null;
}

/**{
    "tableName": "Users-demo",
    "keyConditionExpression": "authProvider = :authProvider",
    "expressionAttributeValues": {
        ":authProvider": "APP"
    },
    "indexName": "authProviderIndex"
}
*/
export async function getItemsBySellerId(
    sellerId: string
): Promise<Item | null> {
    console.log('Request Body:', {
        tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
        keyConditionExpression: 'sellerId = :sellerId',
        expressionAttributeValues: { ':sellerId': sellerId },
    });

    const user = await axios.post(process.env.DB_RECORDS_API_URL + '/query', {
        tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
        keyConditionExpression: 'sellerId = :sellerId',
        expressionAttributeValues: {
            ':sellerId': sellerId,
        },
        indexName: 'SellerIdIndex',
    });
    return user.data.data || null;
}

export async function createItem(item: {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    category: Category;
    relatedGame?: string;
    status?: Status;
    imgUrl?: string[];
    rating?: number;
    formData?: string;
}): Promise<Partial<Item>> {
    const itemId = uuidv4().toString();

    const recordData = {
        itemId,
        sellerId: item.sellerId,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        relatedGame: item.relatedGame ?? '',
        status: item.status ?? Status.ACTIVE,
        imgUrl: item.imgUrl ?? [],
        rating: item.rating ?? 0,
        formData: item.formData ?? '',
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    };

    const createRecordResponse = await axios.post(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
            data: recordData,
        }
    );

    // Add the item into the seller's list of items
    const partialItem: Partial<Item> = {
        itemId,
        title: recordData.title,
        price: recordData.price,
        category: recordData.category,
        relatedGame: recordData.relatedGame,
        status: recordData.status,
        rating: recordData.rating,
    };

    await updateUser(item.sellerId, {
        listOfItems: [partialItem],
    });

    return createRecordResponse.data.data || null;
}

export async function updateItem(
    itemId: string,
    updates: Partial<Item>
): Promise<Item | null> {
    const updateData = {
        ...updates,
        updatedAt: Date.now().toString(),
    };

    const updateResponse = await axios.put(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
            key: {
                itemId: itemId,
            },
            data: updateData,
        }
    );

    return updateResponse.data.data || null;
}

export async function deleteItem(itemId: string): Promise<Item | null> {
    const deleteResponse = await axios.delete(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            data: {
                tableName: process.env.DB_TABLE_NAME_ITEMS || 'Items-demo',
                key: {
                    itemId: itemId,
                },
            },
        }
    );

    return deleteResponse.data.data || null;
}
