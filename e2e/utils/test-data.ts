export function createCarName(prefix = 'e2e-car') {
    return `${prefix}-${Date.now()}`;
}