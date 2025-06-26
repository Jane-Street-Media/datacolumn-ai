import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Check, Hourglass, Loader2, OctagonX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Pricing({ plans, subscription, isSubscribed }) {
    const [billing, setBilling] = useState('Monthly');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPlanId, setLoadingPlanId] = useState(null);
    const markerRef = useRef(null);
    const monthlyRef = useRef(null);
    const yearlyRef = useRef(null);

    useEffect(() => {
        if (monthlyRef.current && markerRef.current) {
            toggleRepositionMarker(monthlyRef.current);
            markerRef.current.classList.remove('opacity-0');
            setTimeout(() => {
                markerRef.current.classList.add('duration-300', 'ease-out');
            }, 10);
        }
    }, []);

    const toggleRepositionMarker = (toggleButton) => {
        if (!markerRef.current) return;
        markerRef.current.style.width = `${toggleButton.offsetWidth}px`;
        markerRef.current.style.height = `${toggleButton.offsetHeight}px`;
        markerRef.current.style.left = `${toggleButton.offsetLeft}px`;
    };

    const handleMouseEnter = (index) => {
        setHoveredCard(index);
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };
    const handleCheckoutClick = (e, planId, plan) => {
        if (plan.name.toLowerCase() === 'enterprise') {
            toast('Contact Support', {
                description: () => 'Coming Soon!',
                icon: <Hourglass className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            });
            return;
        }
        if (loading) {
            e.preventDefault();
            return;
        }
        router.get(
            route('checkout', planId),
            {},
            {
                showProgress: false,
                preserveScroll: true,
                preserveState: true,
                onStart: () => {
                    setLoading(true);
                    setLoadingPlanId(planId);
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

    const handleSwapSubscription = (e, planId, plan) => {
        if (plan.name.toLowerCase() === 'enterprise') {
            toast('Contact Support', {
                description: () => 'Coming Soon!',
                icon: <Hourglass className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            });
            return;
        }
        if (loading) {
            e.preventDefault();
            return;
        }
        router.patch(
            route('checkout.swap', planId),
            {},
            {
                showProgress: false,
                preserveScroll: true,
                onStart: () => {
                    setLoading(true);
                    setLoadingPlanId(planId);
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

    const filteredPlans = plans.filter((plan) => {
        if (billing === 'Monthly' && plan.monthly_price !== undefined) {
            return true;
        }
        if (billing === 'Yearly' && plan.yearly_price !== undefined) {
            return true;
        }
        return false;
    });
    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Chart Your Course</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">Set sail and discover the riches of our value-packed plans.</p>
            </div>

            <div className="mb-12 flex justify-center">
                <div className="relative inline-flex items-center justify-center rounded-full border p-1">
                    <div
                        ref={monthlyRef}
                        onClick={() => {
                            if (!loading) {
                                setBilling('Monthly');
                                toggleRepositionMarker(monthlyRef.current);
                            }
                        }}
                        className={`relative z-20 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            billing === 'Monthly' ? 'text-white' : 'text-[#012A38] dark:text-white'
                        } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                        Monthly
                    </div>
                    <div
                        ref={yearlyRef}
                        onClick={() => {
                            if (!loading) {
                                setBilling('Yearly');
                                toggleRepositionMarker(yearlyRef.current);
                            }
                        }}
                        className={`relative z-20 rounded-full px-4 py-2 text-sm font-medium text-[#012A38] transition-colors dark:text-white ${
                            billing === 'Yearly' ? 'text-white' : 'text-[#012A38] dark:text-white'
                        } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                        Yearly
                    </div>
                    <div ref={markerRef} className="absolute left-0 z-10 h-full w-1/2 opacity-0">
                        <div className="bg-primary h-full w-full rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Card container - changed from grid to flex */}
            <div className="flex flex-wrap justify-center">
                {filteredPlans.map((plan, index) => {
                    const planId = billing === 'Monthly' ? plan.monthly_chargebee_id : plan.yearly_chargebee_id;
                    const isLoading = loading && loadingPlanId === planId;

                    return (
                        <div
                            key={index}
                            onMouseEnter={() => !loading && handleMouseEnter(index)}
                            onMouseLeave={() => !loading && handleMouseLeave()}
                            className={`mb-6 max-w-[400px] min-w-[300px] flex-1 px-3 transition-all duration-300 ease-in-out ${loading && !isLoading ? 'opacity-50' : ''}`}
                        >
                            <div
                                className={`bg-card relative flex h-full flex-col overflow-hidden rounded-xl border-2 shadow-md ${
                                    hoveredCard === index ? 'border-primary' : plan.default && hoveredCard === null ? 'border-primary' : 'border-card'
                                }`}
                            >
                                <div className="px-6 pt-6">
                                    <span className={`text-foreground inline-block rounded-full px-4 py-1 text-sm font-medium dark:text-white`}>
                                        {plan.name}
                                    </span>
                                </div>
                                <div className="mt-4 px-6">
                                    <div className="flex items-baseline">
                                        <span className={`text-4xl font-bold ${hoveredCard === index ? 'text-primary' : 'text-foreground'}`}>
                                            {getSymbolFromCurrency(plan?.currency)}
                                            {billing === 'Monthly' ? plan.monthly_price : plan.yearly_price}
                                        </span>
                                        <span className="text-secondary-foreground ml-1 text-lg font-medium">
                                            /{billing === 'Monthly' ? 'mo' : 'yr'}
                                        </span>
                                    </div>
                                    <p className="text-secondary-foreground mt-2">{`${plan.description ?? ''}`}</p>
                                </div>

                                <div className="bg-card mt-auto p-6">
                                    <ul className="space-y-3">
                                        {plan.features &&
                                            plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <Check
                                                        className={`mt-0.5 mr-2 h-5 w-5 flex-shrink-0 ${
                                                            hoveredCard === index ? 'text-primary' : 'text-foreground'
                                                        }`}
                                                    />
                                                    <span className="text-foreground">{feature}</span>
                                                </li>
                                            ))}
                                    </ul>

                                    <ul className="space-y-3 pt-4">
                                        {plan.details &&
                                            plan.details.map((detail, i) => (
                                                <li key={i} className="flex items-start">
                                                    <Check
                                                        className={`mt-0.5 mr-2 h-5 w-5 flex-shrink-0 ${
                                                            hoveredCard === index ? 'text-primary' : 'text-foreground'
                                                        }`}
                                                    />
                                                    <span className="text-foreground">{detail}</span>
                                                </li>
                                            ))}
                                    </ul>

                                    <ul className="space-y-3 pt-4">
                                        {plan.limitations &&
                                            plan.limitations.map((limitation, i) => (
                                                <li key={i} className="flex items-start">
                                                    <OctagonX
                                                        className={`mt-0.5 mr-2 h-5 w-5 flex-shrink-0 ${
                                                            hoveredCard === index ? 'text-primary' : 'text-foreground'
                                                        }`}
                                                    />
                                                    <span className="text-foreground">{limitation}</span>
                                                </li>
                                            ))}
                                    </ul>
                                    <div className="mt-6">
                                        {!isSubscribed ? (
                                            plan.name.toLowerCase() === 'free' ? (
                                                <span className="absolute top-2 right-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 shadow-sm ring-1 ring-green-300 ring-inset">
                                                    Free Trial
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={(e) => handleCheckoutClick(e, planId, plan)}
                                                    className={`block w-full rounded-lg px-4 py-3 text-center font-medium transition-all ${
                                                        plan.default
                                                            ? 'bg-primary'
                                                            : 'from-gradient-from to-gradient-to hover:bg-gradient-to bg-gradient-to-r'
                                                    } ${loading ? 'cursor-not-allowed' : ''}`}
                                                >
                                                    {isLoading ? (
                                                        <span className="flex items-center justify-center">
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Processing...
                                                            </>
                                                        </span>
                                                    ) : plan.cta ? (
                                                        plan.cta
                                                    ) : (
                                                        'Get Started'
                                                    )}
                                                </button>
                                            )
                                        ) : subscription.chargebee_price !== planId ? (
                                            plan.name.toLowerCase() === 'free' ? (
                                                <span className="absolute top-2 right-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 shadow-sm ring-1 ring-green-300 ring-inset">
                                                    Free Trial
                                                </span>
                                            ) : (
                                                <Button
                                                    onClick={(e) => handleSwapSubscription(e, planId, plan)}
                                                    variant="gradient"
                                                    className={`${loading ? 'cursor-not-allowed' : ''}`}
                                                >
                                                    {isLoading ? (
                                                        <span className="flex items-center justify-center">
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Processing...
                                                            </>
                                                        </span>
                                                    ) : plan.name.toLowerCase() === 'enterprise' ? (
                                                        (plan.cta ?? 'Contact Sales')
                                                    ) : (
                                                        'Swap Subscription'
                                                    )}
                                                </Button>
                                            )
                                        ) : (
                                            <span className="absolute top-2 right-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 shadow-sm ring-1 ring-green-300 ring-inset">
                                                Current Plan
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {(plan.default && hoveredCard === null) || hoveredCard === index ? (
                                    <div className="absolute top-0 right-0 h-1 w-full"></div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
