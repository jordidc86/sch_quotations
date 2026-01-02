import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const quotation = await prisma.quotation.upsert({
            where: { quotationNumber: data.quotationNumber },
            update: {
                vendorId: data.vendorId,
                vendorName: data.vendorName,
                clientName: data.clientName,
                clientDetails: data.clientDetails,
                items: data.items,
                discount: data.discount,
                total: data.total,
                paymentTerms: data.paymentTerms,
                date: new Date(data.date),
            },
            create: {
                quotationNumber: data.quotationNumber,
                vendorId: data.vendorId,
                vendorName: data.vendorName,
                clientName: data.clientName,
                clientDetails: data.clientDetails,
                items: data.items,
                discount: data.discount,
                total: data.total,
                paymentTerms: data.paymentTerms,
                date: new Date(data.date),
            },
        });

        return NextResponse.json(quotation);
    } catch (error) {
        console.error('Error saving quotation:', error);
        return NextResponse.json({ error: 'Failed to save quotation' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const quotations = await prisma.quotation.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(quotations);
    } catch (error) {
        console.error('Error fetching quotations:', error);
        return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
    }
}
