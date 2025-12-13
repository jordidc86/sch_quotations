"use client";

import { useState } from "react";
import { SavedQuotation, getAllQuotations, deleteQuotation } from "@/lib/storage";

interface QuotationLoaderProps {
    onLoad: (quotation: SavedQuotation) => void;
    onClose: () => void;
}

export function QuotationLoader({ onLoad, onClose }: QuotationLoaderProps) {
    const [quotations, setQuotations] = useState<SavedQuotation[]>(getAllQuotations());

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this quotation?")) {
            deleteQuotation(id);
            setQuotations(getAllQuotations());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Load Previous Quotation</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                    {quotations.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-lg mb-2">No saved quotations found</p>
                            <p className="text-sm">Create a quotation and it will be automatically saved</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quotations
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((quote) => (
                                    <div
                                        key={quote.id}
                                        className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors border border-slate-700 hover:border-blue-500"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-white">
                                                        {quote.quotationNumber}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                                        {quote.vendorName}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 font-semibold">
                                                    {quote.clientName || "[No client name]"}
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    {new Date(quote.date).toLocaleDateString()} • {quote.items.length} items • €{quote.total.toLocaleString("en-IE", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onLoad(quote)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(quote.id)}
                                                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                                                    title="Delete quotation"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
