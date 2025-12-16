"use client";

import { useState } from "react";
import predefinedKits from "@/public/predefined-kits.json";

interface Kit {
    id: string;
    name: string;
    envelope: string;
    basket: string;
    burner: string;
    description: string;
}

interface KitLoaderProps {
    isOpen: boolean;
    vendorId: string;
    onLoadKit: (envelope: string, basket: string, burner: string) => void;
    onClose: () => void;
}

export function KitLoader({ isOpen, vendorId, onLoadKit, onClose }: KitLoaderProps) {
    const kits = (predefinedKits as any)[vendorId] as Kit[] || [];

    const handleLoadKit = (kit: Kit) => {
        onLoadKit(kit.envelope, kit.basket, kit.burner);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Load Predefined Kit</h2>
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
                    {kits.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-lg mb-2">No predefined kits available</p>
                            <p className="text-sm">Kits are only available for Pasha balloons</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {kits.map((kit) => (
                                <div
                                    key={kit.id}
                                    className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors border border-slate-700 hover:border-blue-500 cursor-pointer"
                                    onClick={() => handleLoadKit(kit)}
                                >
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {kit.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        {kit.description}
                                    </p>
                                    <div className="space-y-1 text-xs text-slate-300">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Envelope:</span>
                                            <span className="font-mono">{kit.envelope}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Basket:</span>
                                            <span className="font-mono">{kit.basket}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Burner:</span>
                                            <span className="font-mono">{kit.burner}</span>
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
