import AppLogoIcon from '@/components/app-logo-icon';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ChargebeeBanner from '@/pages/banners/chargebeeBanner';
import Pricing from '@/pages/pricing/pricing';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
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
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const PauseSubscriptionButton = () => {
        const [isLoading, setIsLoading] = useState(false);

        const handleClick = (e: React.MouseEvent) => {
            if(isLoading){
                e.preventDefault()
                return;
            }
            router.patch(
                route('subscription.pause'),
                {},
                {
                    showProgress: false,
                    preserveScroll: true,
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: (response) => {
                        toast.success(response.props.flash.success);
                        setPauseModalOpen(false)
                    },
                    onFinish: () => setIsLoading(false),
                },
            );
        };

        return !isLoading ? (
            <button
                type={`button`}
                href={route('subscription.pause')}
                className={`rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${isLoading ? 'cursor-wait bg-red-400' : ''}`}
                aria-disabled={isLoading}
                onClick={handleClick}
            >
                Pause now
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
        e.preventDefault()
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
                                        <AppLogoIcon className="h-8 w-8" />
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
                                className="border-opacity-30 dark:border-opacity-50 overflow-hidden rounded-xl border-2 border-[#012A38] bg-white shadow-lg hover:border-[#FF3300] dark:bg-zinc-800"
                                onMouseEnter={() => setHoveredPlan('current')}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                <div
                                    className={`flex items-center justify-between border-b border-gray-200 p-6 transition-all duration-300 dark:border-gray-700 ${
                                        hoveredPlan === 'current' ? 'border-[#FF3300]' : ''
                                    }`}
                                >
                                    <div>
                                        <h2
                                            className={`text-lg font-semibold ${
                                                hoveredPlan === 'current' ? 'text-[#FF3300] dark:text-[#FF3300]' : 'text-zinc-900 dark:text-zinc-50'
                                            } transition-colors duration-300`}
                                        >
                                            {subscription.items[0].plan_name}
                                        </h2>
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
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">Renews: {formatDate(subscription.next_billing_at)}</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6 grid grid-cols-3 gap-4">
                                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Card Number</p>
                                            <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                                                {`**** **** **** ${auth?.user.pm_last_four || '****'}`}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Billing Cycle</p>
                                            <p className="text-sm text-zinc-900 dark:text-zinc-50">
                                                {subscription.chargebee_price?.match(/Monthly/i) ? 'Monthly' : 'Yearly'}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                                            <p className="text-sm text-zinc-900 dark:text-zinc-50">{subscription.currency}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                        <h3 className="text-md mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Subscription Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-white dark:bg-zinc-800">
                                                        <th className="border border-gray-200 p-2 text-left text-zinc-900 dark:border-gray-700 dark:text-zinc-50">
                                                            Product
                                                        </th>
                                                        <th className="border border-gray-200 p-2 text-center text-zinc-900 dark:border-gray-700 dark:text-zinc-50">
                                                            Quantity
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subscription.items?.map((item, index) => (
                                                        <tr key={index} className="border-t">
                                                            <td className="border border-gray-200 p-2 text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                                {item.plan_name}
                                                            </td>
                                                            <td className="border border-gray-200 p-2 text-center text-zinc-600 dark:border-gray-700 dark:text-zinc-300">
                                                                {item.quantity}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
                                        <h3 className="text-md mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Features Included</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="flex items-center">
                                                <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-zinc-700 dark:text-zinc-300">Unlimited Projects</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-zinc-700 dark:text-zinc-300">Premium Support</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-zinc-700 dark:text-zinc-300">Advanced Analytics</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-zinc-700 dark:text-zinc-300">Custom Integrations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 bg-zinc-50 p-6 md:flex-row dark:bg-zinc-900">
                                    <button
                                        onClick={handleUpdatePaymentMethod}
                                        disabled={isUpdating}
                                        className={`flex-1 cursor-pointer rounded-lg bg-[#012A38] px-4 py-3 text-center font-medium text-white transition-all hover:bg-[#FF3300] disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        {isUpdating ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Updating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-2 h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Update Payment Method
                                            </span>
                                        )}
                                    </button>
                                    {subscription?.chargebee_status === 'paused' ? (
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
                                                    Resume Subscription
                                                </span>
                                            )}
                                        </button>
                                    ) : subscription?.chargebee_status === 'active' ? (
                                        <button
                                            onClick={() => setPauseModalOpen(true)}
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
                                                Pause Subscription
                                            </span>
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {pauseModalOpen && (
                        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-800">
                                <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Confirm Cancellation</h3>
                                <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                                    Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your
                                    current billing cycle.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setPauseModalOpen(false)}
                                        className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-zinc-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        Keep Subscription
                                    </button>
                                    <PauseSubscriptionButton />
                                </div>
                            </div>
                        </div>
                    )}

                    <Pricing plans={plans} subscription={subscription} isSubscribed={isSubscribed} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default SubscriptionSettings;
