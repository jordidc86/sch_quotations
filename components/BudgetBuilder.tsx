"use client";

import { useState, useMemo, useEffect } from "react";
import { Catalog, CatalogItem, SelectedItem } from "@/types";
import { CategorySection } from "./CategorySection";
import { LivePreview } from "./LivePreview";
import { KitLoader } from "./KitLoader";
import { getCategoryBehavior } from "@/lib/category-logic";
import { SavedQuotation, saveQuotation } from "@/lib/storage";

interface VendorInfo {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

interface BudgetBuilderProps {
    catalog: Catalog;
    vendorInfo: VendorInfo;
    loadedQuotation?: SavedQuotation | null;
    onQuotationLoaded?: () => void;
}

export function BudgetBuilder({ catalog, vendorInfo, loadedQuotation, onQuotationLoaded }: BudgetBuilderProps) {
    // Key: Item ID -> SelectedItem
    const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map());
    const [discount, setDiscount] = useState<number>(0);

    // Kit loader state
    const [showKitLoader, setShowKitLoader] = useState(false);

    // Client Details State
    const [clientDetails, setClientDetails] = useState({
        name: "",
        country: "",
        phone: "",
        email: ""
    });

    // Quotation Number Logic (Year + Correlative)
    const [quotationNumber, setQuotationNumber] = useState("");

    // Load saved quotation if provided
    useEffect(() => {
        if (loadedQuotation && onQuotationLoaded) {
            // Restore client details
            setClientDetails(loadedQuotation.clientDetails);

            // Restore discount
            setDiscount(loadedQuotation.discount);

            // Restore quotation number
            setQuotationNumber(loadedQuotation.quotationNumber);

            // Restore selected items
            const itemsMap = new Map<string, SelectedItem>();
            loadedQuotation.items.forEach(savedItem => {
                // Find the actual item in catalog
                const catalogItem = catalog.categories
                    .flatMap(cat => cat.items)
                    .find(item => item.id === savedItem.itemId);

                if (catalogItem) {
                    itemsMap.set(savedItem.itemId, {
                        item: catalogItem,
                        quantity: savedItem.quantity,
                        customPrice: savedItem.customPrice
                    });
                }
            });
            setSelectedItems(itemsMap);

            // Mark as loaded
            onQuotationLoaded();
        }
    }, [loadedQuotation]);

    useEffect(() => {
        // Generate initial quotation number on client load
        if (!quotationNumber) {
            const year = new Date().getFullYear();
            const randomSeq = Math.floor(100 + Math.random() * 900);
            setQuotationNumber(`${year}-${randomSeq}`);
        }
    }, []);

    // Convert Map to Array for easier rendering
    const selectedList = useMemo(() => Array.from(selectedItems.values()), [selectedItems]);

    // Calculate total with percentage discount
    const totalAmount = useMemo(() => {
        const rawTotal = selectedList.reduce((sum, { item, quantity, customPrice }) => {
            const price = customPrice !== undefined ? customPrice : item.price;
            return sum + (price * quantity);
        }, 0);

        // Discount is now a percentage
        const discountAmount = (rawTotal * discount) / 100;
        return Math.max(0, rawTotal - discountAmount);
    }, [selectedList, discount]);

    // Auto-save quotation whenever state changes
    useEffect(() => {
        if (selectedItems.size > 0 && quotationNumber) {
            const quotation: SavedQuotation = {
                id: quotationNumber,
                vendorId: vendorInfo.id,
                vendorName: vendorInfo.name,
                date: new Date().toISOString(),
                clientName: clientDetails.name,
                clientDetails,
                items: Array.from(selectedItems.values()).map(({ item, quantity, customPrice }) => ({
                    itemId: item.id,
                    itemName: item.name,
                    category: item.category || "UNKNOWN",
                    quantity,
                    price: item.price,
                    customPrice
                })),
                discount,
                total: totalAmount,
                quotationNumber
            };
            saveQuotation(quotation);
        }
    }, [selectedItems, clientDetails, discount, quotationNumber, totalAmount, vendorInfo]);

    const handleSelect = (item: CatalogItem, qty: number, customPrice?: number) => {
        const behavior = getCategoryBehavior(item.category);

        setSelectedItems(prev => {
            const next = new Map(prev);

            // Enforce single selection for specific categories
            if (behavior === "single") {
                // Remove other items from same category
                for (const [key, val] of Array.from(next.entries())) {
                    if (val.item.category === item.category) {
                        next.delete(key);
                    }
                }
            }

            next.set(item.id, { item, quantity: qty, customPrice });
            return next;
        });
    };

    const handleRemove = (itemId: string) => {
        setSelectedItems(prev => {
            const next = new Map(prev);
            next.delete(itemId);
            return next;
        });
    };

    const handleAddCustomItem = (name: string, description: string, price: number) => {
        const newItem: CatalogItem = {
            id: `custom_${Date.now()}`,
            name,
            description,
            price,
            category: "CUSTOM"
        };
        handleSelect(newItem, 1);
    };

    // Load kit handler
    const handleLoadKit = (envelope: string, basket: string, burner: string) => {
        // Find items in catalog
        const envelopeItem = catalog.categories
            .find(cat => cat.name.toUpperCase() === "ENVELOPE")
            ?.items.find(item => item.name === envelope);

        const basketItem = catalog.categories
            .find(cat => cat.name.toUpperCase() === "BASKET")
            ?.items.find(item => item.name === basket);

        const burnerItem = catalog.categories
            .find(cat => cat.name.toUpperCase() === "BURNER")
            ?.items.find(item => item.name === burner);

        // Clear current selection and add kit items
        setSelectedItems(new Map());

        if (envelopeItem) handleSelect({ ...envelopeItem, category: "ENVELOPE" }, 1);
        if (basketItem) setTimeout(() => handleSelect({ ...basketItem, category: "BASKET" }, 1), 100);
        if (burnerItem) setTimeout(() => handleSelect({ ...burnerItem, category: "BURNER" }, 1), 200);
    };

    // Get selected envelope for compatibility filtering
    const selectedEnvelope = useMemo(() => {
        const envelopeCategory = catalog.categories.find(cat => cat.name.toUpperCase() === "ENVELOPE");
        if (!envelopeCategory) return null;

        for (const [itemId, selected] of selectedItems) {
            const item = envelopeCategory.items.find(i => i.id === itemId);
            if (item) return item.name;
        }
        return null;
    }, [selectedItems, catalog]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Scrollable Catalog */}
            <div className="flex-1">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowKitLoader(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Load Predefined Kit
                    </button>
                </div>
                {catalog.categories.map((cat) => (
                    <CategorySection
                        key={cat.name}
                        category={cat}
                        selectedItems={selectedItems}
                        selectedEnvelope={selectedEnvelope}
                        vendorId={vendorInfo.id}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                    />
                ))}
            </div>

            {/* Right: Sticky Preview */}
            <div className="w-full lg:w-[400px] xl:w-[450px]">
                <div className="sticky top-8">
                    <LivePreview
                        items={selectedList}
                        total={totalAmount}
                        discount={discount}
                        onDiscountChange={setDiscount}
                        clientDetails={clientDetails}
                        onClientDetailsChange={setClientDetails}
                        quotationNumber={quotationNumber}
                        onAddCustomItem={handleAddCustomItem}
                        onRemoveItem={handleRemove}
                        vendorInfo={vendorInfo}
                    />
                </div>
            </div>

            {showKitLoader && (
                <KitLoader
                    vendorId={vendorInfo.id}
                    onLoadKit={handleLoadKit}
                    onClose={() => setShowKitLoader(false)}
                />
            )}
        </div>
    );
}
