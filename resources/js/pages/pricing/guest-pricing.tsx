import { Link } from '@inertiajs/react';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Check, OctagonX, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Pricing({ plans }) {
    const [billing, setBilling] = useState('Monthly');
    const [hoveredCard, setHoveredCard] = useState(null);
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
        <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Chart Your Course</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">Everything you need to build, share, and scale your data insights.</p>
            </div>

            <div className="mb-12 flex justify-center">
                <div className="relative inline-flex items-center justify-center rounded-full border p-1">
                    <div
                        ref={monthlyRef}
                        onClick={() => {
                            setBilling('Monthly');
                            toggleRepositionMarker(monthlyRef.current);
                        }}
                        className={`relative z-20 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            billing === 'Monthly' ? 'text-white' : 'text-[#012A38] dark:text-white'
                        }`}
                    >
                        Monthly
                    </div>
                    <div
                        ref={yearlyRef}
                        onClick={() => {
                            setBilling('Yearly');
                            toggleRepositionMarker(yearlyRef.current);
                        }}
                        className={`relative z-20 rounded-full px-4 py-2 text-sm font-medium text-[#012A38] transition-colors dark:text-white ${
                            billing === 'Yearly' ? 'text-white' : 'text-[#012A38] dark:text-white'
                        } `}
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
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave()}
                            className={`mb-6 max-w-[400px] min-w-[300px] flex-1 px-3 transition-all duration-300 ease-in-out`}
                        >
                            <div
                                className={`bg-card relative flex h-full flex-col overflow-hidden rounded-xl border-2 shadow-md ${
                                    hoveredCard === index ? 'border-primary' : plan.default && hoveredCard === null ? 'border-primary' : 'border-card'
                                }`}
                            >
                                {plan.popular ? (
                                    <div className="absolute top-0 right-0 h-16 w-16">
                                        <div className="from-gradient-from to-gradient-to absolute top-[32px] right-[-34px] w-[170px] rotate-45 transform bg-gradient-to-r text-center text-white">
                                            Popular
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
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

                                <div className="bg-card p-6">
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
                                        {plan.name.toLowerCase() === 'enterprise' ? (
                                            <a
                                                href={`mailto:${import.meta.env.VITE_MAIL_FROM_ADDRESS}`}
                                                className="from-gradient-from to-gradient-to focus-visible:border-ring focus-visible:ring-ring absolute right-5 bottom-4 left-5 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-all outline-none disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                            >
                                                Get in touch
                                            </a>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="from-gradient-from to-gradient-to focus-visible:border-ring focus-visible:ring-ring absolute right-5 bottom-4 left-5 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-all outline-none disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                            >
                                                {plan.cta ?? 'Get Started'}
                                            </Link>
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
            <div className="py-10 bg-card relative flex h-full flex-col overflow-hidden rounded-xl border-2 shadow-md border-card">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                        Need more?
                    </h2>
                    <p className="text-lg sm:text-lg text-secondary-foreground dark:text-primary-foreground/80 mb-6 sm:mb-8">
                        Our team is here to help you find the perfect solution for your needs. Whether you're a startup, a growing business, or an enterprise,
                        we can tailor our services to fit your requirements.
                    </p>

                    <a
                        href="https://support.datacolumn.ai"
                        className="w-1/4 min-w-fit m-auto from-gradient-from to-gradient-to focus-visible:border-ring focus-visible:ring-ring absolute right-5 bottom-4 left-5 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-all outline-none disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-8"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </section>
    );
}
