export function convertToUpperCase(str: string): string {
    return str.toUpperCase();
}

export function convertToLowerCase(str: string): string {
    return str.toLowerCase();
}

export function formatSummaryPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
