export function getSingleRouteParam(value) {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }
    if (Array.isArray(value) &&
        typeof value[0] === 'string' &&
        value[0].trim().length > 0) {
        return value[0].trim();
    }
    return null;
}
