import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ChargebeeBanner from '@/pages/banners/chargebeeBanner';
import Pricing from '@/pages/pricing/pricing';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, CreditCard, Loader2, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Details',
        href: '/settings/subscription',
    },
];

const SubscriptionSettings: React.FC = ({ subscription: subscription, plans }) => {
    const { auth } = usePage<SharedData>().props;
    const isSubscribed = subscription != null;
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

        return !isLoading ? (
            <button
                type={`button`}
                className={`rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${isLoading ? 'cursor-wait bg-red-400' : ''}`}
                aria-disabled={isLoading}
                onClick={handleClick}
            >
                Cancel now
            </button>
        ) : (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
            </>
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
                <div className="p-6">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Subscription</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300">Manage your subscription and payment details</p>
                    </div>

                    {!isSubscribed ? (
                        <div className="mx-auto max-w-4xl">
                            <div className="border-opacity-30 dark:border-opacity-50 mb-8 overflow-hidden rounded-xl border-2 border-[#012A38] bg-white shadow-lg dark:bg-zinc-800">
                                <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                                    <div className="mb-4 flex items-center justify-center space-x-2">
                                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">No Active Subscription</h2>
                                    </div>
                                    <p className="mb-4 text-center text-zinc-600 dark:text-zinc-300">
                                        You don't have an active subscription. Choose a plan below to get started.
                                    </p>
                                </div>
                            </div>
                            <ChargebeeBanner />
                        </div>
                    ) : (
                        <div className="mx-auto max-w-4xl">
                            <div
                                className="border-opacity-30 dark:border-opacity-50 bg-card overflow-hidden rounded-xl"
                                onMouseEnter={() => setHoveredPlan('current')}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                <div className={`flex items-center justify-between p-6 transition-all duration-300`}>
                                    <div>
                                        <h2 className="text-foreground text-lg font-semibold">{subscription.plan.display_name}</h2>
                                        <p
                                            className={`text-sm font-medium ${
                                                subscription.chargebee_status?.toLowerCase() === 'in_trial'
                                                    ? 'text-amber-500 dark:text-amber-400'
                                                    : subscription.chargebee_status?.toLowerCase() === 'active'
                                                      ? 'text-green-600 dark:text-green-400'
                                                      : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            {subscription.chargebee_status?.toUpperCase() || 'ACTIVE'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">Started: {formatDate(subscription.created_at)}</p>
                                        {subscription.ends_at ? (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">Ends at: {formatDate(subscription.ends_at)}</p>
                                        ) : (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                Renews: {formatDate(subscription.next_billing_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6 grid grid-cols-3 gap-4">
                                        <div className="border-primary rounded-lg border p-3">
                                            <p className="text-foreground text-sm">Card Number</p>
                                            <p className="text-secondary-foreground mt-1 text-sm">
                                                {`**** **** **** ${auth?.user.pm_last_four || '****'}`}
                                            </p>
                                        </div>
                                        <div className="border-primary rounded-lg border p-3">
                                            <p className="text-foreground text-sm">Billing Cycle</p>
                                            <p className="text-secondary-foreground text-sm">
                                                {subscription.chargebee_price?.match(/Monthly/i) ? 'Monthly' : 'Yearly'}
                                            </p>
                                        </div>
                                        <div className="border-primary rounded-lg border p-3">
                                            <p className="text-foreground text-sm">Currency</p>
                                            <p className="text-secondary-foreground text-sm">{subscription.plan.currency}</p>
                                        </div>
                                    </div>

                                    <div className="bg-card mb-6 rounded-lg">
                                        <h3 className="text-md text-foreground mb-3 font-semibold">Subscription Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-secondary">
                                                        <th className="text-foreground border p-2 text-center">Product</th>
                                                        <th className="text-foreground border p-2 text-center">Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-t">
                                                        <td className="border border-gray-200 p-2 text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                            {subscription.plan.display_name}
                                                        </td>
                                                        <td className="border border-gray-200 p-2 text-center text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                            {subscription.plan.quantity}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                        <h3 className="text-md mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Features Included</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {subscription.plan.details &&
                                                subscription.plan.details.map((detail) => {
                                                    return (
                                                        <div className="flex items-center">
                                                            <Check className={`mr-2 h-5 w-5 text-green-500`} />
                                                            <span className="text-zinc-700 dark:text-zinc-300">{detail}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 bg-zinc-50 p-6 md:flex-row dark:bg-zinc-900">
                                    <button
                                        onClick={handleUpdatePaymentMethod}
                                        disabled={isUpdating}
                                        className={`hover:bg-primary flex-1 cursor-pointer rounded-lg bg-[#012A38] px-4 py-3 text-center font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        {isUpdating ? (
                                            <span className="flex items-center justify-center">
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <CreditCard className="mr-2 h-5 w-5"/>
                                                Update Payment Method
                                            </span>
                                        )}
                                    </button>
                                    {canResumeSubscription ? (
                                        <button
                                            onClick={(e) => handleResumeSubscription(e)}
                                            className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-zinc-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    <XCircle className="mr-2 h-5 w-5"/>
                                                    Resume Subscription
                                                </span>
                                            )}
                                        </button>
                                    ) : subscription?.chargebee_status.toLowerCase() === 'active' ? (
                                        <button
                                            onClick={() => setCancelSubscriptionModalOpen(true)}
                                            className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-zinc-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                        >
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-2 h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Cancel Subscription
                                            </span>
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {cancelSubscriptionModalOpen && (
                        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-800">
                                <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Confirm Cancellation</h3>
                                <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                                    Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your
                                    current billing cycle.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={(e) => {
                                            if (isLoading) {
                                                e.preventDefault();
                                                return;
                                            } else {
                                                setCancelSubscriptionModalOpen(false);
                                            }
                                        }}
                                        aria-disabled={isLoading}
                                        className={`${isLoading ? 'cursor-wait bg-red-400' : ''} cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-zinc-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700`}
                                    >
                                        Keep Subscription
                                    </button>
                                    <CancelSubscriptionButton />
                                </div>
                            </div>
                        </div>
                    )}

                    {!canResumeSubscription ? <Pricing plans={plans} subscription={subscription} isSubscribed={isSubscribed} /> : <></>}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default SubscriptionSettings;
