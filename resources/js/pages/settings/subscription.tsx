import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ChargebeeBanner from '@/pages/banners/chargebeeBanner';
import Pricing from '@/pages/pricing/pricing';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, CreditCard, Loader2, XCircle, X, Download, Calendar, DollarSign, Shield, AlertTriangle } from 'lucide-react';
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
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-wait transition-all duration-200"
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

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'in_trial') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Trial
                </span>
            );
        } else if (statusLower === 'active') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <Shield className="w-3 h-3 mr-1" />
                    Active
                </span>
            );
        } else if (statusLower === 'non_renewing') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    <XCircle className="w-3 h-3 mr-1" />
                    Ending Soon
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <X className="w-3 h-3 mr-1" />
                    Inactive
                </span>
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription" />
            <SettingsLayout>
                <div className="w-full overflow-x-hidden">
                    <div className="p-3 sm:p-6 max-w-full">
                        {/* Header Section */}
                        <div className="mx-auto mb-6 sm:mb-12 max-w-3xl text-center">
                            <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Subscription Management</h1>
                            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300">Manage your subscription, payment details, and billing preferences</p>
                        </div>

                        {!isSubscribed ? (
                            /* Free Plan State */
                            <div className="w-full max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 text-center">
                                        <div className="text-white">
                                            <h2 className="text-3xl font-bold mb-4">Ready to Chart Your Course?</h2>
                                            <p className="text-xl text-blue-100 mb-6">
                                                You're currently on the free plan. Unlock premium features with a subscription.
                                            </p>
                                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-6">
                                                <span className="font-medium">Starting from $19/month</span>
                                            </div>
                                            <div className="mt-6">
                                                <Button 
                                                    onClick={() => {
                                                        // Scroll to pricing section or navigate to upgrade
                                                        const pricingSection = document.querySelector('[data-pricing-section]');
                                                        if (pricingSection) {
                                                            pricingSection.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }}
                                                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                                >
                                                    View Plans
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Active Subscription State */
                            <div className="w-full max-w-4xl mx-auto">
                                {/* Main Subscription Card */}
                                <div className="w-full border-opacity-30 dark:border-opacity-50 bg-card overflow-hidden rounded-xl shadow-lg">
                                    {/* Header with gradient */}
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-2">
                                                    {subscription.plan.display_name}
                                                </h2>
                                                {getStatusBadge(subscription.chargebee_status)}
                                            </div>
                                            <div className="mt-4 sm:mt-0 text-right">
                                                <div className="text-white/90 text-sm">
                                                    <div className="flex items-center mb-1">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Started: {formatDate(subscription.created_at)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {subscription.ends_at ? 
                                                            `Ends: ${formatDate(subscription.ends_at)}` : 
                                                            `Renews: ${formatDate(subscription.next_billing_at)}`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Payment & Billing Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center mb-3">
                                                    <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">Payment Method</h3>
                                                </div>
                                                <p className="text-2xl font-mono text-gray-700 dark:text-gray-300">
                                                    •••• •••• •••• {auth?.user.pm_last_four || '••••'}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center mb-3">
                                                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">Billing Cycle</h3>
                                                </div>
                                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                                    {subscription.chargebee_price?.match(/Monthly/i) ? 'Monthly' : 'Yearly'}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center mb-3">
                                                    <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">Currency</h3>
                                                </div>
                                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                                    {subscription.plan.currency}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Subscription Details */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-700">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Plan Details</h3>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{subscription.plan.display_name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {subscription.plan.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <a 
                                                        href="/user/invoice/1" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download Invoice
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Plan Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {subscription.plan.details?.map((detail, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                                    >
                                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                onClick={handleUpdatePaymentMethod}
                                                disabled={isUpdating}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 h-12"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="mr-2 h-4 w-4"/>
                                                        Update Payment Method
                                                    </>
                                                )}
                                            </Button>
                                            
                                            {canResumeSubscription ? (
                                                <Button
                                                    onClick={handleResumeSubscription}
                                                    disabled={loading}
                                                    variant="outline"
                                                    className="flex-1 h-12 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="mr-2 h-4 w-4"/>
                                                            Resume Subscription
                                                        </>
                                                    )}
                                                </Button>
                                            ) : subscription?.chargebee_status.toLowerCase() === 'active' ? (
                                                <Button
                                                    onClick={() => setCancelSubscriptionModalOpen(true)}
                                                    variant="outline"
                                                    className="flex-1 h-12 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancel Subscription
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Modal */}
                        {cancelSubscriptionModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
                                        <div className="flex items-center">
                                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
                                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                                                Confirm Cancellation
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing cycle.
                                        </p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                onClick={() => {
                                                    if (!isLoading) {
                                                        setCancelSubscriptionModalOpen(false);
                                                    }
                                                }}
                                                disabled={isLoading}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Keep Subscription
                                            </Button>
                                            <div className="flex-1">
                                                <CancelSubscriptionButton />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pricing Section */}
                        {!canResumeSubscription && !isSubscribed && (
                            <div className="mt-8 sm:mt-12 w-full overflow-x-hidden" data-pricing-section>
                                <div className="w-full max-w-full overflow-x-hidden -mx-3 px-3 sm:-mx-6 sm:px-6">
                                    <Pricing plans={plans} subscription={subscription} isSubscribed={isSubscribed} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default SubscriptionSettings;
