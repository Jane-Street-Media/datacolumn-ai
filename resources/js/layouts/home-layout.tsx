import Header from '@/components/header';
import { motion } from 'framer-motion';
import Footer from '@/components/footer';
import { AppearanceProvider } from '@/contexts/appearance-context';
import { Head, usePage } from '@inertiajs/react';

const asset = (file) => {
    const page = usePage();
    return `${page.props.base_url}/${file}`;
};

export default function HomeLayout({ children }) {
    return (
        <AppearanceProvider>
            <Head>
                {/* Basic Meta Tags */}
                <title>DataColumn.ai - AI-Powered Data Visualization for Journalists</title>
                <meta
                    name="description"
                    content="Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights."
                />
                <meta
                    name="keywords"
                    content="data visualization, AI charts, journalism tools, data analysis, business intelligence, infographics, data storytelling, chart maker"
                />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="DataColumn.ai - AI-Powered Data Visualization for Journalists" />
                <meta
                    name="twitter:description"
                    content="Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights."
                />
                <meta name="twitter:image" content={asset('logo.svg')} />
                <meta name="twitter:creator" content="@datacolumnai" />
                <meta name="twitter:site" content="@datacolumnai" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: 'DataColumn.ai',
                        description:
                            'Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights.',
                        url: 'https://datacolumn.ai',
                        applicationCategory: 'BusinessApplication',
                        operatingSystem: 'Web',
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'USD',
                            availability: 'https://schema.org/InStock',
                        },
                        creator: {
                            '@type': 'Organization',
                            name: 'DataColumn.ai',
                            url: 'https://datacolumn.ai',
                        },
                        screenshot: asset('logo.svg'),
                        featureList: [
                            'AI-powered chart creation',
                            'Multiple chart types',
                            'CSV data import',
                            'Real-time collaboration',
                            'Professional exports',
                            'Embed generation',
                        ],
                    })}
                </script>
            </Head>

            <div className="bg-background relative min-h-screen transition-colors duration-300">
                {/* Animated Background Charts - FIXED Z-INDEX */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    {/* Bar Chart Background - Top Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -100, y: -50 }}
                        animate={{ opacity: 0.08, x: 0, y: 0 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute top-20 left-10 z-10 h-64 w-80"
                    >
                        <svg viewBox="0 0 300 200" className="h-full w-full">
                            <defs>
                                <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <g>
                                <motion.rect
                                    x="40"
                                    y="120"
                                    width="35"
                                    height="70"
                                    fill="url(#barGradient1)"
                                    initial={{ height: 0, y: 190 }}
                                    animate={{ height: 70, y: 120 }}
                                    transition={{ duration: 1.2, delay: 1 }}
                                />
                                <motion.rect
                                    x="85"
                                    y="90"
                                    width="35"
                                    height="100"
                                    fill="url(#barGradient1)"
                                    initial={{ height: 0, y: 190 }}
                                    animate={{ height: 100, y: 90 }}
                                    transition={{ duration: 1.2, delay: 1.3 }}
                                />
                                <motion.rect
                                    x="130"
                                    y="60"
                                    width="35"
                                    height="130"
                                    fill="url(#barGradient1)"
                                    initial={{ height: 0, y: 190 }}
                                    animate={{ height: 130, y: 60 }}
                                    transition={{ duration: 1.2, delay: 1.6 }}
                                />
                                <motion.rect
                                    x="175"
                                    y="100"
                                    width="35"
                                    height="90"
                                    fill="url(#barGradient1)"
                                    initial={{ height: 0, y: 190 }}
                                    animate={{ height: 90, y: 100 }}
                                    transition={{ duration: 1.2, delay: 1.9 }}
                                />
                                <motion.rect
                                    x="220"
                                    y="80"
                                    width="35"
                                    height="110"
                                    fill="url(#barGradient1)"
                                    initial={{ height: 0, y: 190 }}
                                    animate={{ height: 110, y: 80 }}
                                    transition={{ duration: 1.2, delay: 2.2 }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Line Chart Background - Top Right */}
                    <motion.div
                        initial={{ opacity: 0, y: -100, x: 100 }}
                        animate={{ opacity: 0.07, y: 0, x: 0 }}
                        transition={{ duration: 2.5, delay: 1 }}
                        className="absolute top-32 right-16 z-10 h-72 w-96"
                    >
                        <svg viewBox="0 0 400 250" className="h-full w-full">
                            <defs>
                                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                                </linearGradient>
                                <linearGradient id="areaGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                                </linearGradient>
                            </defs>
                            <g>
                                <motion.path
                                    d="M30,180 Q80,120 140,140 T260,90 T350,110"
                                    fill="none"
                                    stroke="url(#lineGradient1)"
                                    strokeWidth="4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, delay: 1.5 }}
                                />
                                <motion.path
                                    d="M30,180 Q80,120 140,140 T260,90 T350,110 L350,220 L30,220 Z"
                                    fill="url(#areaGradient1)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.5, delay: 3 }}
                                />
                                {/* Data points */}
                                {[
                                    { x: 30, y: 180, delay: 2 },
                                    { x: 80, y: 120, delay: 2.3 },
                                    { x: 140, y: 140, delay: 2.6 },
                                    { x: 200, y: 100, delay: 2.9 },
                                    { x: 260, y: 90, delay: 3.2 },
                                    { x: 320, y: 105, delay: 3.5 },
                                    { x: 350, y: 110, delay: 3.8 },
                                ].map((point, index) => (
                                    <motion.circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r="6"
                                        fill="#8b5cf6"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.8 }}
                                        transition={{ duration: 0.5, delay: point.delay }}
                                    />
                                ))}
                            </g>
                        </svg>
                    </motion.div>

                    {/* Pie Chart Background - Bottom Left */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
                        animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
                        transition={{ duration: 2, delay: 1.5 }}
                        className="absolute bottom-32 left-20 z-10 h-64 w-64"
                    >
                        <svg viewBox="0 0 160 160" className="h-full w-full">
                            <g>
                                <motion.path
                                    d="M80,80 L80,20 A60,60 0 0,1 125,35 Z"
                                    fill="#10b981"
                                    fillOpacity="0.6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    transition={{ duration: 0.8, delay: 2.5 }}
                                />
                                <motion.path
                                    d="M80,80 L125,35 A60,60 0 0,1 125,125 Z"
                                    fill="#f59e0b"
                                    fillOpacity="0.5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ duration: 0.8, delay: 2.8 }}
                                />
                                <motion.path
                                    d="M80,80 L125,125 A60,60 0 0,1 35,125 Z"
                                    fill="#ef4444"
                                    fillOpacity="0.4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    transition={{ duration: 0.8, delay: 3.1 }}
                                />
                                <motion.path
                                    d="M80,80 L35,125 A60,60 0 0,1 80,20 Z"
                                    fill="#6366f1"
                                    fillOpacity="0.3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    transition={{ duration: 0.8, delay: 3.4 }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Scatter Plot Background - Bottom Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, y: 100 }}
                        animate={{ opacity: 0.05, x: 0, y: 0 }}
                        transition={{ duration: 2.5, delay: 2 }}
                        className="absolute right-32 bottom-20 z-10 h-48 w-72"
                    >
                        <svg viewBox="0 0 280 160" className="h-full w-full">
                            <g>
                                {[
                                    { x: 40, y: 120, delay: 3, size: 5, color: '#f97316' },
                                    { x: 70, y: 90, delay: 3.1, size: 6, color: '#06b6d4' },
                                    { x: 100, y: 100, delay: 3.2, size: 4, color: '#84cc16' },
                                    { x: 130, y: 70, delay: 3.3, size: 7, color: '#f59e0b' },
                                    { x: 160, y: 80, delay: 3.4, size: 5, color: '#8b5cf6' },
                                    { x: 190, y: 50, delay: 3.5, size: 6, color: '#ef4444' },
                                    { x: 220, y: 60, delay: 3.6, size: 4, color: '#10b981' },
                                    { x: 250, y: 40, delay: 3.7, size: 8, color: '#3b82f6' },
                                    { x: 60, y: 110, delay: 3.8, size: 5, color: '#f97316' },
                                    { x: 110, y: 85, delay: 3.9, size: 6, color: '#06b6d4' },
                                    { x: 170, y: 95, delay: 4, size: 4, color: '#84cc16' },
                                    { x: 200, y: 75, delay: 4.1, size: 5, color: '#f59e0b' },
                                    { x: 240, y: 55, delay: 4.2, size: 7, color: '#8b5cf6' },
                                ].map((point, index) => (
                                    <motion.circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r={point.size}
                                        fill={point.color}
                                        fillOpacity="0.7"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.7 }}
                                        transition={{ duration: 0.6, delay: point.delay }}
                                    />
                                ))}
                            </g>
                        </svg>
                    </motion.div>

                    {/* Additional Floating Elements */}
                    <motion.div
                        initial={{ opacity: 0, y: -50, rotate: -30 }}
                        animate={{ opacity: 0.04, y: 0, rotate: 0 }}
                        transition={{ duration: 4, delay: 0.5 }}
                        className="absolute top-1/2 left-1/4 z-10 h-40 w-40"
                    >
                        <svg viewBox="0 0 120 120" className="h-full w-full">
                            <g>
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="3"
                                    strokeOpacity="0.4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, delay: 3 }}
                                />
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="30"
                                    fill="#6366f1"
                                    fillOpacity="0.15"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5, delay: 4 }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
                        animate={{ opacity: 0.03, rotate: 0, scale: 1 }}
                        transition={{ duration: 5, delay: 1 }}
                        className="absolute top-3/4 right-1/4 z-10 h-32 w-56"
                    >
                        <svg viewBox="0 0 200 100" className="h-full w-full">
                            <g>
                                <motion.rect
                                    x="20"
                                    y="70"
                                    width="12"
                                    height="25"
                                    fill="#ec4899"
                                    fillOpacity="0.5"
                                    initial={{ height: 0 }}
                                    animate={{ height: 25 }}
                                    transition={{ duration: 1, delay: 4.5 }}
                                />
                                <motion.rect
                                    x="40"
                                    y="50"
                                    width="12"
                                    height="45"
                                    fill="#ec4899"
                                    fillOpacity="0.5"
                                    initial={{ height: 0 }}
                                    animate={{ height: 45 }}
                                    transition={{ duration: 1, delay: 4.7 }}
                                />
                                <motion.rect
                                    x="60"
                                    y="35"
                                    width="12"
                                    height="60"
                                    fill="#ec4899"
                                    fillOpacity="0.5"
                                    initial={{ height: 0 }}
                                    animate={{ height: 60 }}
                                    transition={{ duration: 1, delay: 4.9 }}
                                />
                                <motion.rect
                                    x="80"
                                    y="45"
                                    width="12"
                                    height="50"
                                    fill="#ec4899"
                                    fillOpacity="0.5"
                                    initial={{ height: 0 }}
                                    animate={{ height: 50 }}
                                    transition={{ duration: 1, delay: 5.1 }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Floating Data Points */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.04 }}
                        transition={{ duration: 2, delay: 2 }}
                        className="absolute top-1/3 right-1/3 z-10 h-32 w-32"
                    >
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                            <g>
                                {[
                                    { x: 20, y: 30, delay: 5, color: '#06b6d4' },
                                    { x: 50, y: 20, delay: 5.2, color: '#84cc16' },
                                    { x: 80, y: 40, delay: 5.4, color: '#f59e0b' },
                                    { x: 30, y: 60, delay: 5.6, color: '#ef4444' },
                                    { x: 70, y: 70, delay: 5.8, color: '#8b5cf6' },
                                ].map((point, index) => (
                                    <motion.circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r="3"
                                        fill={point.color}
                                        fillOpacity="0.6"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: point.delay }}
                                    />
                                ))}
                            </g>
                        </svg>
                    </motion.div>
                </div>

                {/* Header */}
                <Header />

                {children}

                {/* Footer */}
                <Footer />
            </div>
        </AppearanceProvider>
    );
}
