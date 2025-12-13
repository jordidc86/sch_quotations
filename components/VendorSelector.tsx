"use client";

import { useState } from "react";

interface VendorSelectorProps {
    onSelectVendor: (vendorId: string) => void;
}

export function VendorSelector({ onSelectVendor }: VendorSelectorProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Balloon Budget Tool
                    </h1>
                    <p className="text-xl text-slate-300">
                        Select a manufacturer to begin
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Schroeder Card */}
                    <button
                        onClick={() => onSelectVendor("schroeder")}
                        className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20 hover:border-blue-400 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-bold text-white">S</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-3">
                                SCHROEDER
                            </h2>

                            <p className="text-slate-300 mb-4">
                                THEO SCHROEDER fire balloons GmbH
                            </p>

                            <div className="text-sm text-slate-400 space-y-1">
                                <p>🇩🇪 Schweich, Germany</p>
                                <p>📧 mail@schroederballon.de</p>
                            </div>
                        </div>
                    </button>

                    {/* Pasha Card */}
                    <button
                        onClick={() => onSelectVendor("pasha")}
                        className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20 hover:border-red-400 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-bold text-white">P</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-3">
                                PASHA
                            </h2>

                            <p className="text-slate-300 mb-4">
                                Pasha Balloons
                            </p>

                            <div className="text-sm text-slate-400 space-y-1">
                                <p>🇹🇷 Nevşehir, Turkey</p>
                                <p>📧 info@pashaballoons.com</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-12 text-center text-slate-400 text-sm">
                    <p>Professional quotation generator for hot air balloon manufacturers</p>
                </div>
            </div>
        </div>
    );
}
