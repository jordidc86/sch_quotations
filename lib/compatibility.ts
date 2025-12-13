import compatibilityRules from '../public/compatibility-rules.json';

export interface CompatibilityRules {
    [vendor: string]: {
        [envelope: string]: {
            baskets: string[];
            burners: string[];
        };
    };
}

const rules = compatibilityRules as CompatibilityRules;

/**
 * Get compatible baskets for a given envelope
 */
export function getCompatibleBaskets(vendorId: string, envelopeName: string): string[] {
    const vendorRules = rules[vendorId];
    if (!vendorRules) return [];

    const envelopeRules = vendorRules[envelopeName];
    if (!envelopeRules) return [];

    return envelopeRules.baskets || [];
}

/**
 * Get compatible burners for a given envelope
 */
export function getCompatibleBurners(vendorId: string, envelopeName: string): string[] {
    const vendorRules = rules[vendorId];
    if (!vendorRules) return [];

    const envelopeRules = vendorRules[envelopeName];
    if (!envelopeRules) return [];

    return envelopeRules.burners || [];
}

/**
 * Check if a basket is compatible with an envelope
 */
export function isBasketCompatible(vendorId: string, envelopeName: string, basketName: string): boolean {
    const compatibleBaskets = getCompatibleBaskets(vendorId, envelopeName);
    return compatibleBaskets.includes(basketName);
}

/**
 * Check if a burner is compatible with an envelope
 */
export function isBurnerCompatible(vendorId: string, envelopeName: string, burnerName: string): boolean {
    const compatibleBurners = getCompatibleBurners(vendorId, envelopeName);
    return compatibleBurners.includes(burnerName);
}
