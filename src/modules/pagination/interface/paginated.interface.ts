import { registerEnumType } from '@nestjs/graphql';

export interface Paginated<T> {
    data: T[];
    meta: {
        totalPages: number;
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
    };
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

registerEnumType(SortOrder, {
    name: 'SortOrder',
});
