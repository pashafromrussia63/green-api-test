export function normalizePhone(raw: string): string {
    return raw.replace(/\D/g, '');
}

export function isValidPhone(digits: string): boolean {
    return digits.length >= 10 && digits.length <= 15;
}

export function formatPhone(digits: string): string {
    if (digits.length === 11 && digits.startsWith('7')) {
        return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
    return `+${digits}`;
}