/**
 * Converts a string to a URL-friendly slug
 * e.g. "Classic White T-Shirt" → "classic-white-t-shirt"
 */
export const slugify = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
