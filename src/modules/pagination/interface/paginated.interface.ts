import { Type } from '@nestjs/common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

registerEnumType(SortOrder, {
    name: 'SortOrder',
});

@ObjectType()
export class PaginationMeta {
    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    totalItems: number;

    @Field(() => Int)
    currentPage: number;

    @Field(() => Int)
    itemsPerPage: number;
}

export function Paginated<T>(ItemClass: Type<T>): any {
    // Tự động tạo tên class, ví dụ: "PaginatedUser"
    @ObjectType(`Paginated${ItemClass.name}`)
    abstract class PaginatedType {
        // Tạo field 'data' là một mảng của TItemClass
        @Field(() => [ItemClass])
        data: T[];

        // Sử dụng lại class PaginationMeta đã tạo ở Bước 1
        @Field(() => PaginationMeta)
        meta: PaginationMeta;
    }

    // Trả về class vừa tạo
    return PaginatedType;
}
