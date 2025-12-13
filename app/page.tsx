"use client";

import { useState, useEffect } from "react";
import { BudgetBuilder } from "@/components/BudgetBuilder";
import { VendorSelector } from "@/components/VendorSelector";
import { QuotationLoader } from "@/components/QuotationLoader";
import { SavedQuotation } from "@/lib/storage";
import { Catalog } from "@/types";

interface VendorInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  catalogFile: string;
}

export default function Home() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loadedQuotation, setLoadedQuotation] = useState<SavedQuotation | null>(null);

  const handleVendorSelect = async (vendorId: string) => {
    setLoading(true);
    try {
      // Load vendor info
      const vendorsRes = await fetch("/vendors.json");
      const vendors = await vendorsRes.json();
      const vendor = vendors[vendorId];
      setVendorInfo(vendor);

      // Load catalog
      const catalogRes = await fetch(`/${vendor.catalogFile}`);
      const catalogData = await catalogRes.json();
      setCatalog(catalogData);

      setSelectedVendor(vendorId);
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQuotation = async (quotation: SavedQuotation) => {
    setShowLoader(false);
    await handleVendorSelect(quotation.vendorId);
    setLoadedQuotation(quotation);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!selectedVendor || !catalog || !vendorInfo) {
    return <VendorSelector onSelectVendor={handleVendorSelect} />;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Balloon Budget Tool</h1>
            <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">
              {vendorInfo.name}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLoader(true)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              Load Quote
            </button>
            <button
              onClick={() => {
                setSelectedVendor(null);
                setCatalog(null);
                setVendorInfo(null);
                setLoadedQuotation(null);
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Change Vendor
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <BudgetBuilder
          catalog={catalog}
          vendorInfo={vendorInfo}
          loadedQuotation={loadedQuotation}
          onQuotationLoaded={() => setLoadedQuotation(null)}
        />
      </div>

      {showLoader && (
        <QuotationLoader
          onLoad={handleLoadQuotation}
          onClose={() => setShowLoader(false)}
        />
      )}
    </main>
  );
}
