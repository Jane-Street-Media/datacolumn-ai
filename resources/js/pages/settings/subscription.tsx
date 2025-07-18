import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ChargebeeBanner from '@/pages/banners/chargebeeBanner';
import Pricing from '@/pages/pricing/pricing';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, CreditCard, Loader2, XCircle, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Details',
        href: '/settings/subscription',
    },
];

const SubscriptionSettings: React.FC = ({ subscription: subscription, plans }) => {
    const { auth } = usePage<SharedData>().props;
    const isSubscribed = subscription.plan.chargebee_id !== 'free-monthly';
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [cancelSubscriptionModalOpen, setCancelSubscriptionModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const canResumeSubscription = useMemo(() => subscription?.chargebee_status === 'non_renewing', [subscription]);
    
    const CancelSubscriptionButton = () => {
        const handleClick = (e: React.MouseEvent) => {
            if (isLoading) {
                e.preventDefault();
                return;
            }
            router.patch(
                route('subscription.cancel'),
                {},
                {
                    showProgress: false,
                    preserveScroll: true,
                    only: ['subscription', 'flash'],
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: (response) => {
                        toast.success(response.props.flash.success);
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            toast.error(errors.error);
                        }
                    },
                    onFinish: () => {
                        setCancelSubscriptionModalOpen(false);
                        setIsLoading(false);
                    },
                },
            );
        };

        return (
            <Button
                type="button"
                className={`rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-wait disabled:bg-red-400`}
                disabled={isLoading}
                onClick={handleClick}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    'Cancel now'
                )}
            </Button>
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Format currency for display
    const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    };

    const handleUpdatePaymentMethod = () => {
        setIsUpdating(true);
        window.location.href = '/update-payment-method';
    };

    const [loading, setLoading] = useState(false);
    const handleResumeSubscription = (e) => {
        e.preventDefault();
        router.patch(
            route('subscription.resume'),
            {},
            {
                showProgress: false,
                preserveScroll: true,
                onStart: () => {
                    setLoading(true);
                },
                onSuccess: (response) => {
                    toast.success(response.props.flash.success);
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    }
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription" />
            <SettingsLayout>
                <div className="p-3 sm:p-6">
                    <div className="mx-auto mb-6 sm:mb-12 max-w-3xl text-center">
                        <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Subscription</h1>
                        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300">Manage your subscription and payment details</p>
                    </div>

                    {!isSubscribed ? (
                        <div className="mx-auto max-w-4xl">
                            <div className="border-opacity-30 dark:border-opacity-50 mb-6 sm:mb-8 overflow-hidden rounded-xl border-2 border-[#012A38] bg-white shadow-lg dark:bg-zinc-800">
                                <div className="border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
                                    <div className="mb-3 sm:mb-4 flex items-center justify-center space-x-2">
                                        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">No Active Subscription</h2>
                                    </div>
                                    <p className="mb-3 sm:mb-4 text-center text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                                        You don't have an active subscription. Choose a plan below to get started.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-4xl">
                            <div className="border-opacity-30 dark:border-opacity-50 bg-card overflow-hidden rounded-xl shadow-lg">
                                {/* Subscription Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 space-y-3 sm:space-y-0">
                                    <div>
                                        <h2 className="text-foreground text-lg sm:text-xl font-semibold">{subscription.plan.display_name}</h2>
                                        <p className={`text-sm font-medium ${
                                            subscription.chargebee_status?.toLowerCase() === 'in_trial'
                                                ? 'text-amber-500 dark:text-amber-400'
                                                : subscription.chargebee_status?.toLowerCase() === 'active'
                                                  ? 'text-green-600 dark:text-green-400'
                                                  : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {subscription.chargebee_status?.toUpperCase() || 'ACTIVE'}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">Started: {formatDate(subscription.created_at)}</p>
                                        {subscription.ends_at ? (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">Ends: {formatDate(subscription.ends_at)}</p>
                                        ) : (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                Renews: {formatDate(subscription.next_billing_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* Payment & Billing Info - Mobile: Stacked cards, Desktop: Grid */}
                                    <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <div className="border-primary rounded-lg border p-3 sm:p-4">
                                            <p className="text-foreground text-sm font-medium">Card Number</p>
                                            <p className="text-secondary-foreground mt-1 text-sm">
                                                {`**** **** **** ${auth?.user.pm_last_four || '****'}`}
                                            </p>
                                        </div>
                                        <div className="border-primary rounded-lg border p-3 sm:p-4">
                                            <p className="text-foreground text-sm font-medium">Billing Cycle</p>
                                            <p className="text-secondary-foreground mt-1 text-sm">
                                                {subscription.chargebee_price?.match(/Monthly/i) ? 'Monthly' : 'Yearly'}
                                            </p>
                                        </div>
                                        <div className="border-primary rounded-lg border p-3 sm:p-4">
                                            <p className="text-foreground text-sm font-medium">Currency</p>
                                            <p className="text-secondary-foreground mt-1 text-sm">{subscription.plan.currency}</p>
                                        </div>
                                    </div>

                                    {/* Subscription Items - Mobile: Card layout, Desktop: Table */}
                                    <div className="bg-card mb-4 sm:mb-6 rounded-lg">
                                        <h3 className="text-md text-foreground mb-3 font-semibold">Subscription Items</h3>
                                        
                                        {/* Mobile: Card layout */}
                                        <div className="sm:hidden bg-gray-50 dark:bg-zinc-700 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Product</p>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{subscription.plan.display_name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Quantity</p>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{subscription.plan.quantity}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop: Table layout */}
                                        <div className="hidden sm:block overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-secondary">
                                                        <th className="text-foreground border p-3 text-left text-sm font-medium">Product</th>
                                                        <th className="text-foreground border p-3 text-center text-sm font-medium">Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-gray-200 p-3 text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                            {subscription.plan.display_name}
                                                        </td>
                                                        <td className="border border-gray-200 p-3 text-center text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                            {subscription.plan.quantity}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4 sm:mb-6 rounded-lg bg-gray-50 p-3 sm:p-4 dark:bg-zinc-700">
                                        <h3 className="text-md mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Features Included</h3>
                                        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
                                            {subscription.plan.details &&
                                                subscription.plan.details.map((detail, index) => (
                                                    <div className="flex items-center" key={index}>
                                                        <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{detail}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 sm:gap-4 bg-zinc-50 p-4 sm:p-6 sm:flex-row dark:bg-zinc-900">
                                    <button
                                        onClick={handleUpdatePaymentMethod}
                                        disabled={isUpdating}
                                        className="hover:bg-primary flex-1 cursor-pointer rounded-lg bg-[#012A38] px-4 py-3 text-center font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] flex items-center justify-center"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5"/>
                                                <span className="text-sm sm:text-base">Update Payment Method</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {canResumeSubscription ? (
                                        <button
                                            onClick={handleResumeSubscription}
                                            disabled={loading}
                                            className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-zinc-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 min-h-[44px] flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5"/>
                                                    <span className="text-sm sm:text-base">Resume Subscription</span>
                                                </>
                                            )}
                                        </button>
                                    ) : subscription?.chargebee_status.toLowerCase() === 'active' ? (
                                        <button
                                            onClick={() => setCancelSubscriptionModalOpen(true)}
                                            className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-zinc-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700 min-h-[44px] flex items-center justify-center"
                                        >
                                            <X className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="text-sm sm:text-base">Cancel Subscription</span>
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancel Subscription Modal - Mobile optimized */}
                    {cancelSubscriptionModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="w-full max-w-md rounded-lg bg-white p-4 sm:p-6 dark:bg-zinc-800">
                                <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">Confirm Cancellation</h3>
                                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                                    Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your
                                    current billing cycle.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                                    <button
                                        onClick={() => {
                                            if (!isLoading) {
                                                setCancelSubscriptionModalOpen(false);
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-zinc-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-50 min-h-[44px] flex items-center justify-center order-2 sm:order-1"
                                    >
                                        Keep Subscription
                                    </button>
                                    <div className="order-1 sm:order-2">
                                        <CancelSubscriptionButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!canResumeSubscription && (
                        <Pricing plans={plans} subscription={subscription} isSubscribed={isSubscribed} />
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default SubscriptionSettings;
