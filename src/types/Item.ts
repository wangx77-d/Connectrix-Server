export interface Item {
    itemId: string;
    sellerId: string;
    title: string;
    description: string;
    price: number;
    category: Category;
    relatedGame: string;
    status: Status;
    imgUrl: string[];
    rating: number;
    formData: string;
}

export enum Category {
    GOODS = 'GOODS',
    TUTORIAL = 'TUTORIAL',
    // Add more categories as needed
}

export enum Status {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    INACTIVE = 'INACTIVE', // not list for sale
}
