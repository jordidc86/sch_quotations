// Quotation storage utilities using both LocalStorage and MySQL via API
import { SelectedItem } from "./types";

export interface SavedQuotation {
    id: string;
    vendorId: string;
    vendorName: string;
    date: string;
    clientName: string;
    clientDetails: {
        name: string;
        country: string;
        phone: string;
        email: string;
    };
    items: SelectedItem[];
    discount: number;
    total: number;
    quotationNumber: string;
    paymentTerms?: string;
}

const STORAGE_KEY = "balloon_quotations";

/**
 * Saves a quotation to both LocalStorage (for offline/cache) and the Database via API.
 */
export async function saveQuotation(quotation: SavedQuotation): Promise<void> {
    try {
        // 1. Sync to LocalStorage
        const existing = getAllQuotationsLocal();
        const updated = [...existing.filter(q => q.id !== quotation.id), quotation];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // 2. Sync to Database
        const response = await fetch('/api/quotations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotation),
        });

        if (!response.ok) {
            console.error("Failed to sync quotation to database");
        }
    } catch (error) {
        console.error("Error saving quotation:", error);
    }
}

/**
 * Retrieves all quotations from the LocalStorage cache.
 */
export function getAllQuotationsLocal(): SavedQuotation[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error loading quotations from LocalStorage:", error);
        return [];
    }
}

/**
 * Retrieves all quotations from the Database.
 */
export async function getAllQuotationsServer(): Promise<SavedQuotation[]> {
    try {
        const response = await fetch('/api/quotations');
        if (response.ok) {
            const serverData = await response.json();
            // Optional: Update LocalStorage with server data
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
            return serverData;
        }
    } catch (error) {
        console.error("Error fetching quotations from server:", error);
    }
    return getAllQuotationsLocal();
}

/**
 * Legacy wrapper to maintain compatibility while transitioning
 */
export function getAllQuotations(): SavedQuotation[] {
    return getAllQuotationsLocal();
}

export function getQuotationLocal(id: string): SavedQuotation | null {
    const all = getAllQuotationsLocal();
    return all.find(q => q.id === id) || null;
}

export async function deleteQuotation(id: string): Promise<void> {
    try {
        // 1. Remove from LocalStorage
        const existing = getAllQuotationsLocal();
        const updated = existing.filter(q => q.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // 2. Sync deletion to database (requires [id] route)
        const response = await fetch(`/api/quotations/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error("Failed to delete quotation from database");
        }
    } catch (error) {
        console.error("Error deleting quotation:", error);
    }
}
