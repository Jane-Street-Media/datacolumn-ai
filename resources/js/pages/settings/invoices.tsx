import React, {useEffect, useState} from "react";
import {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";
import { Download, Eye } from "lucide-react";

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unit_amount: number;
    amount: number;
}

interface Invoice {
    id: string;
    customer_id: string;
    status: string;
    total: number;
    amount_paid: number;
    amount_due: number;
    currency_code: string;
    date: number;
    due_date: number;
    line_items: LineItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/settings/invoices',
    }
];

type InvoicesProps = {
    invoices: Invoice[];
};

const Invoices: React.FC<InvoicesProps> = ({invoices}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
    const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount / 100);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDownloadInvoice = async (invoiceId: string) => {
        setDownloadingInvoiceId(invoiceId);
        setIsLoading(true);
        window.location.href = `/user/invoice/${invoiceId}`;
        setDownloadingInvoiceId(null);
        setIsLoading(false);
    };

    const toggleInvoiceDetails = (invoiceId: string) => {
        setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices"/>
            <SettingsLayout>
                <div className="p-3 sm:p-6">
                    <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">Invoices</h1>
                        <p className="text-base sm:text-lg text-secondary-foreground">
                            View and download your billing history
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12 sm:py-20">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-8 sm:py-10 bg-card rounded-xl shadow-md mx-auto max-w-md">
                            <p className="text-foreground">No invoices found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    {/* Invoice Header - Always visible */}
                                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                                                        Invoice #{invoice.id.slice(-8)}
                                                    </h2>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        invoice.status === "paid"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}>
                                                        {invoice.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-1 sm:space-y-0 sm:space-x-4 sm:flex">
                                                    <span>Date: {formatDate(invoice.date)}</span>
                                                    <span>Due: {formatDate(invoice.due_date)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleInvoiceDetails(invoice.id)}
                                                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors sm:hidden"
                                                >
                                                    <Eye className="w-4 h-4 mr-1 inline" />
                                                    {expandedInvoiceId === invoice.id ? 'Hide' : 'Details'}
                                                </button>
                                                
                                                <a
                                                    href={`/user/invoice/${invoice.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Download</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invoice Summary - Always visible on desktop, collapsible on mobile */}
                                    <div className={`${expandedInvoiceId === invoice.id || 'sm:block'} ${expandedInvoiceId !== invoice.id && 'hidden'} sm:block`}>
                                        <div className="p-4 sm:p-6">
                                            {/* Amount Summary Cards */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-3 sm:p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                                                    <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                                        {formatCurrency(invoice.total, invoice.currency_code)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-3 sm:p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Paid</p>
                                                    <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(invoice.amount_paid, invoice.currency_code)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-3 sm:p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Due</p>
                                                    <p className={`text-lg sm:text-xl font-bold ${
                                                        invoice.amount_due > 0
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-zinc-900 dark:text-zinc-50"
                                                    }`}>
                                                        {formatCurrency(invoice.amount_due, invoice.currency_code)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Line Items */}
                                            <div className="space-y-3 sm:space-y-0">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Items</h3>
                                                
                                                {/* Mobile: Card layout */}
                                                <div className="sm:hidden space-y-3">
                                                    {invoice.line_items.map((item) => (
                                                        <div key={item.id} className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.description}</p>
                                                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                                    {formatCurrency(item.amount, invoice.currency_code)}
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span>Unit: {formatCurrency(item.unit_amount, invoice.currency_code)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Desktop: Table layout */}
                                                <div className="hidden sm:block overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50 dark:bg-zinc-700">
                                                                <th className="border border-gray-200 dark:border-gray-600 p-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-50">Item</th>
                                                                <th className="border border-gray-200 dark:border-gray-600 p-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-50">Qty</th>
                                                                <th className="border border-gray-200 dark:border-gray-600 p-3 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">Unit Price</th>
                                                                <th className="border border-gray-200 dark:border-gray-600 p-3 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {invoice.line_items.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td className="border border-gray-200 dark:border-gray-600 p-3 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</td>
                                                                    <td className="border border-gray-200 dark:border-gray-600 p-3 text-center text-sm text-zinc-600 dark:text-zinc-300">{item.quantity}</td>
                                                                    <td className="border border-gray-200 dark:border-gray-600 p-3 text-right text-sm text-zinc-600 dark:text-zinc-300">{formatCurrency(item.unit_amount, invoice.currency_code)}</td>
                                                                    <td className="border border-gray-200 dark:border-gray-600 p-3 text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(item.amount, invoice.currency_code)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default Invoices;
