import React, {useEffect, useState} from "react";
import {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";
import { Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import AppLogo from "@/components/app-logo";

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

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
                    textColor: 'text-emerald-700 dark:text-emerald-300',
                    borderColor: 'border-emerald-200 dark:border-emerald-700'
                };
            case 'pending':
                return {
                    icon: Clock,
                    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
                    textColor: 'text-amber-700 dark:text-amber-300',
                    borderColor: 'border-amber-200 dark:border-amber-700'
                };
            default:
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    textColor: 'text-red-700 dark:text-red-300',
                    borderColor: 'border-red-200 dark:border-red-700'
                };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices"/>
            <SettingsLayout>
                <div className="p-3 sm:p-6">
                    {/* Header with Logo */}
                    <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16">
                                <AppLogo />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            Invoices
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            View and download your billing history
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-16 sm:py-24">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-100 border-t-blue-600"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8">
                                        <AppLogo />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 max-w-md mx-auto">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                                <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                                    <AppLogo />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No invoices yet</h3>
                                <p className="text-gray-600 dark:text-gray-400">Your invoices will appear here when available.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {invoices.map((invoice) => {
                                const statusConfig = getStatusConfig(invoice.status);
                                const StatusIcon = statusConfig.icon;
                                
                                return (
                                    <div key={invoice.id} className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        {/* Invoice Header with Logo */}
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-10 h-10 flex-shrink-0">
                                                        <AppLogo />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                                Invoice #{invoice.id.slice(-8)}
                                                            </h2>
                                                            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                                                <StatusIcon className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-semibold uppercase tracking-wide">
                                                                    {invoice.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">Issued:</span>
                                                                <span>{formatDate(invoice.date)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">Due:</span>
                                                                <span className={invoice.amount_due > 0 && new Date(invoice.due_date * 1000) < new Date() ? 'text-red-600 font-medium' : ''}>
                                                                    {formatDate(invoice.due_date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => toggleInvoiceDetails(invoice.id)}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors sm:hidden"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2 inline" />
                                                        {expandedInvoiceId === invoice.id ? 'Hide' : 'Details'}
                                                    </button>
                                                    
                                                    <a
                                                        href={`/user/invoice/${invoice.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Invoice Summary - Always visible on desktop, collapsible on mobile */}
                                        <div className={`${expandedInvoiceId === invoice.id || 'sm:block'} ${expandedInvoiceId !== invoice.id && 'hidden'} sm:block`}>
                                            <div className="p-6">
                                                {/* Amount Summary Cards */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Amount</p>
                                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(invoice.total, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-700">
                                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Amount Paid</p>
                                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                                            {formatCurrency(invoice.amount_paid, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                    <div className={`bg-gradient-to-br p-5 rounded-xl border ${
                                                        invoice.amount_due > 0
                                                            ? "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700"
                                                            : "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600"
                                                    }`}>
                                                        <p className={`text-sm font-medium mb-2 ${
                                                            invoice.amount_due > 0
                                                                ? "text-red-600 dark:text-red-400"
                                                                : "text-gray-500 dark:text-gray-400"
                                                        }`}>Amount Due</p>
                                                        <p className={`text-2xl font-bold ${
                                                            invoice.amount_due > 0
                                                                ? "text-red-700 dark:text-red-300"
                                                                : "text-gray-900 dark:text-gray-100"
                                                        }`}>
                                                            {formatCurrency(invoice.amount_due, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Line Items */}
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-6">
                                                        <div className="w-6 h-6">
                                                            <AppLogo />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Invoice Details</h3>
                                                    </div>
                                                    
                                                    {/* Mobile: Card layout */}
                                                    <div className="sm:hidden space-y-3">
                                                        {invoice.line_items.map((item) => (
                                                            <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{item.description}</p>
                                                                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400 ml-3">
                                                                        {formatCurrency(item.amount, invoice.currency_code)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Qty:</span> {item.quantity}
                                                                    </span>
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Unit:</span> {formatCurrency(item.unit_amount, invoice.currency_code)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Desktop: Table layout */}
                                                    <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                                                                    <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Item Description</th>
                                                                    <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">Quantity</th>
                                                                    <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">Unit Price</th>
                                                                    <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-gray-800">
                                                                {invoice.line_items.map((item, index) => (
                                                                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}>
                                                                        <td className="border-b border-gray-100 dark:border-gray-700 p-4 text-sm font-medium text-gray-900 dark:text-gray-100">{item.description}</td>
                                                                        <td className="border-b border-gray-100 dark:border-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-300">{item.quantity}</td>
                                                                        <td className="border-b border-gray-100 dark:border-gray-700 p-4 text-right text-sm text-gray-600 dark:text-gray-300">{formatCurrency(item.unit_amount, invoice.currency_code)}</td>
                                                                        <td className="border-b border-gray-100 dark:border-gray-700 p-4 text-right text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.amount, invoice.currency_code)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default Invoices;
