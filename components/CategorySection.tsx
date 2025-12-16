"use client";

import { CatalogCategory, CatalogItem, SelectedItem } from "@/types";
import { getCategoryBehavior } from "@/lib/category-logic";
import { getCompatibleBaskets, getCompatibleBurners } from "@/lib/compatibility";

interface CategorySectionProps {
    category: CatalogCategory;
    selectedItems: Map<string, SelectedItem>;
    selectedEnvelope: string | null;
    selectedBurner?: string | null;
    vendorId: string;
    onSelect: (item: CatalogItem, qty: number, customPrice?: number, customDescription?: string) => void;
    onRemove: (itemId: string) => void;
}

export function CategorySection({ category, selectedItems, selectedEnvelope, selectedBurner, vendorId, onSelect, onRemove }: CategorySectionProps) {
    const behavior = getCategoryBehavior(category.name);

    // Filter items based on compatibility
    const filteredItems = (() => {
        const categoryUpper = category.name.toUpperCase();

        // Only filter BASKET and BURNER categories if an envelope is selected
        if (!selectedEnvelope && categoryUpper !== "BURNER FRAME") return category.items;

        if (categoryUpper === "BASKET") {
            // If no envelope selected, show all (handled early return), else filter
            if (!selectedEnvelope) return category.items;
            const compatibleBaskets = getCompatibleBaskets(vendorId, selectedEnvelope!);
            return category.items.filter(item => compatibleBaskets.includes(item.name));
        }

        if (categoryUpper === "BURNER") {
            if (!selectedEnvelope) return category.items;
            const compatibleBurners = getCompatibleBurners(vendorId, selectedEnvelope!);
            return category.items.filter(item => compatibleBurners.includes(item.name));
        }

        // Burner Frame Filtering Logic
        if (categoryUpper === "BURNER FRAME" && selectedBurner) {
            const burnerUpper = selectedBurner.toUpperCase();

            // Determine burner type
            let requiredType = "";
            if (burnerUpper.includes("DOUBLE")) requiredType = "DOUBLE";
            else if (burnerUpper.includes("TRIPLE")) requiredType = "TRIPLE";
            else if (burnerUpper.includes("QUAD")) requiredType = "QUADRUPLE";
            else if (burnerUpper.includes("QUADRUPLE")) requiredType = "QUADRUPLE";

            if (requiredType) {
                return category.items.filter(item => item.name.toUpperCase().includes(requiredType));
            }
        }

        return category.items;
    })();

    // Helper to check if item is selected
    const getSelection = (id: string) => selectedItems.get(id);

    // Single Selection Logic (Radio-like)
    const isSelected = (id: string) => selectedItems.has(id);

    const handleSingleSelect = (item: CatalogItem) => {
        if (isSelected(item.id)) {
            onRemove(item.id);
        } else {
            // Inject category name
            onSelect({ ...item, category: category.name }, 1);
        }
    };

    return (
        <section className="mb-8 pl-4 border-l-2 border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-3 uppercase tracking-wider">{category.name}</h3>

            <div className="space-y-2">
                {filteredItems.map(item => {
                    const checked = isSelected(item.id);
                    const selection = getSelection(item.id);
                    const isArtworkOrHyperlast = item.name.toUpperCase().includes("ARTWORK") || item.name.toUpperCase().includes("HYPERLAST CONFIGURATION") || item.name.toUpperCase().includes("100% HYPERLAST PANEL");
                    const isArtwork = item.name.toUpperCase().includes("ARTWORK");

                    return (
                        <div key={item.id} className={`p-3 rounded-lg border transition-all ${checked ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                            <div className="flex items-start gap-3">
                                <div className="pt-1">
                                    {behavior === "single" ? (
                                        <input
                                            type="radio"
                                            name={category.name}
                                            checked={checked}
                                            onChange={() => handleSingleSelect(item)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onSelect({ ...item, category: category.name }, 1);
                                                } else {
                                                    onRemove(item.id);
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className={`font-medium ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{item.name}</span>
                                        <span className="font-mono text-slate-500">
                                            {item.price === 0 && !isArtwork ? "Complimentary" : `€${item.price.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{selection?.customDescription || item.description}</p>
                                </div>
                            </div>

                            {/* Extended Inputs for Selected Items */}
                            {checked && (
                                <div className="mt-3 ml-8 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">

                                    <div className="flex flex-wrap gap-4 items-center">
                                        {/* Quantity Input */}
                                        {behavior === "multi-qty" && (
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs uppercase font-bold text-slate-500">Qty:</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={selection?.quantity?.toString() || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "") {
                                                            onSelect({ ...item, category: category.name }, 0, selection?.customPrice, selection?.customDescription);
                                                        } else {
                                                            const parsed = parseInt(val);
                                                            if (!isNaN(parsed)) {
                                                                onSelect({ ...item, category: category.name }, parsed, selection?.customPrice, selection?.customDescription);
                                                            }
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (!selection?.quantity || selection.quantity < 1) {
                                                            onSelect({ ...item, category: category.name }, 1, selection?.customPrice, selection?.customDescription);
                                                        }
                                                    }}
                                                    className="w-16 p-1 text-sm border rounded"
                                                />
                                            </div>
                                        )}

                                        {/* Custom Price Input for Artwork */}
                                        {isArtwork && (
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs uppercase font-bold text-slate-500">Price (€):</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={selection?.customPrice !== undefined ? selection.customPrice : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "") {
                                                            onSelect({ ...item, category: category.name }, selection?.quantity || 1, 0, selection?.customDescription);
                                                        } else {
                                                            const parsed = parseFloat(val);
                                                            if (!isNaN(parsed)) {
                                                                onSelect({ ...item, category: category.name }, selection?.quantity || 1, parsed, selection?.customDescription);
                                                            }
                                                        }
                                                    }}
                                                    className="w-28 p-1 text-sm border rounded font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Custom Description Input */}
                                    {isArtworkOrHyperlast && (
                                        <div className="w-full">
                                            <label className="text-xs uppercase font-bold text-slate-500 block mb-1">Description / Note:</label>
                                            <input
                                                type="text"
                                                className="w-full p-1.5 text-sm border rounded"
                                                placeholder="Enter custom description..."
                                                value={selection?.customDescription || ""}
                                                onChange={(e) => onSelect({ ...item, category: category.name }, selection?.quantity || 1, selection?.customPrice, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
