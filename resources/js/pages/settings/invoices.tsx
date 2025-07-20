import React, {useEffect, useState} from "react";
import {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";
import { Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";

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
                    {/* Clean Header */}
                    <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                            Invoices
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            View and download your billing history
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-16 sm:py-24">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary/20 border-t-primary"></div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 max-w-md mx-auto">
                            <div className="bg-card rounded-2xl p-8 border shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
                                <p className="text-muted-foreground">Your invoices will appear here when available.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {invoices.map((invoice) => {
                                const statusConfig = getStatusConfig(invoice.status);
                                const StatusIcon = statusConfig.icon;
                                
                                return (
                                    <div key={invoice.id} className="bg-card shadow-lg rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                                        {/* Invoice Header */}
                                        <div className="bg-muted/50 p-6 border-b border-border">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                                            Invoice #{invoice.id.slice(-8)}
                                                        </h2>
                                                        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            <span className="text-xs font-semibold uppercase tracking-wide">
                                                                {invoice.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">Issued:</span>
                                                            <span>{formatDate(invoice.date)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">Due:</span>
                                                            <span className={invoice.amount_due > 0 && new Date(invoice.due_date * 1000) < new Date() ? 'text-destructive font-medium' : ''}>
                                                                {formatDate(invoice.due_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => toggleInvoiceDetails(invoice.id)}
                                                        className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors sm:hidden"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2 inline" />
                                                        {expandedInvoiceId === invoice.id ? 'Hide' : 'Details'}
                                                    </button>
                                                    
                                                    <a
                                                        href={`/user/invoice/${invoice.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Invoice Summary */}
                                        <div className={`${expandedInvoiceId === invoice.id || 'sm:block'} ${expandedInvoiceId !== invoice.id && 'hidden'} sm:block`}>
                                            <div className="p-6">
                                                {/* Amount Summary Cards */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                                    <div className="bg-muted/30 p-5 rounded-xl border border-border">
                                                        <p className="text-sm font-medium text-muted-foreground mb-2">Total Amount</p>
                                                        <p className="text-2xl font-bold text-foreground">
                                                            {formatCurrency(invoice.total, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-700">
                                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Amount Paid</p>
                                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                                            {formatCurrency(invoice.amount_paid, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                    <div className={`p-5 rounded-xl border ${
                                                        invoice.amount_due > 0
                                                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                                                            : "bg-muted/30 border-border"
                                                    }`}>
                                                        <p className={`text-sm font-medium mb-2 ${
                                                            invoice.amount_due > 0
                                                                ? "text-red-600 dark:text-red-400"
                                                                : "text-muted-foreground"
                                                        }`}>Amount Due</p>
                                                        <p className={`text-2xl font-bold ${
                                                            invoice.amount_due > 0
                                                                ? "text-red-700 dark:text-red-300"
                                                                : "text-foreground"
                                                        }`}>
                                                            {formatCurrency(invoice.amount_due, invoice.currency_code)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Line Items */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground mb-6">Invoice Details</h3>
                                                    
                                                    {/* Mobile: Card layout */}
                                                    <div className="sm:hidden space-y-3">
                                                        {invoice.line_items.map((item) => (
                                                            <div key={item.id} className="bg-muted/30 p-4 rounded-xl border border-border">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <p className="font-semibold text-foreground leading-tight">{item.description}</p>
                                                                    <p className="font-bold text-lg text-primary ml-3">
                                                                        {formatCurrency(item.amount, invoice.currency_code)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-muted-foreground">
                                                                        <span className="font-medium">Qty:</span> {item.quantity}
                                                                    </span>
                                                                    <span className="text-muted-foreground">
                                                                        <span className="font-medium">Unit:</span> {formatCurrency(item.unit_amount, invoice.currency_code)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Desktop: Table layout */}
                                                    <div className="hidden sm:block overflow-hidden rounded-xl border border-border">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="bg-muted/50">
                                                                    <th className="border-b border-border p-4 text-left text-sm font-bold text-foreground">Item Description</th>
                                                                    <th className="border-b border-border p-4 text-center text-sm font-bold text-foreground">Quantity</th>
                                                                    <th className="border-b border-border p-4 text-right text-sm font-bold text-foreground">Unit Price</th>
                                                                    <th className="border-b border-border p-4 text-right text-sm font-bold text-foreground">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-card">
                                                                {invoice.line_items.map((item, index) => (
                                                                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-muted/20' : 'bg-card'} hover:bg-muted/30 transition-colors`}>
                                                                        <td className="border-b border-border p-4 text-sm font-medium text-foreground">{item.description}</td>
                                                                        <td className="border-b border-border p-4 text-center text-sm text-muted-foreground">{item.quantity}</td>
                                                                        <td className="border-b border-border p-4 text-right text-sm text-muted-foreground">{formatCurrency(item.unit_amount, invoice.currency_code)}</td>
                                                                        <td className="border-b border-border p-4 text-right text-sm font-bold text-primary">{formatCurrency(item.amount, invoice.currency_code)}</td>
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
