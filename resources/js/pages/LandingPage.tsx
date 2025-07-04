import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';

import { AppearanceProvider } from '@/contexts/appearance-context';

import {
  Play,
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  TrendingUp,
  Palette,
  Type,
  Download,
  Tag,
  Globe,
  ArrowRight,
  Star,
  Zap,
  Upload,
  FolderOpen,
  Quote
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Head, Link, usePage } from '@inertiajs/react';

export default function LandingPage() {

  const chartTypes = [
    { name: 'Bar Chart', icon: BarChart3 },
    { name: 'Line Chart', icon: LineChart },
    { name: 'Pie Chart', icon: PieChart },
    { name: 'Scatter Plot', icon: ScatterChart },
    { name: 'Stacked Area', icon: TrendingUp },
  ];

  const features = [
    {
      icon: Palette,
      title: 'Editorial-grade visuals',
      description: 'Typography, spacing, and colors optimized for news publishing — not dashboards.'
    },
    {
      icon: Type,
      title: 'Smart captions & alt-text',
      description: 'AI-generated chart summaries, alt text, and suggested headlines — always editable.'
    },
    {
      icon: Download,
      title: 'Flexible exports',
      description: 'Download as SVG/PNG, embed live, or publish to a hosted URL.'
    },
    {
      icon: Tag,
      title: 'Source lines + annotations',
      description: 'Add footnotes, inline data highlights, and credits with ease.'
    },
    {
      icon: Globe,
      title: 'Multilingual support',
      description: 'Translate chart labels and captions instantly into other languages.'
    },
    {
      icon: FolderOpen,
      title: 'Best in class organization',
      description: 'Be super efficient with project folders, reusable templates and team access.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Data Reporter',
      organization: 'The Washington Herald',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'DataColumn.ai has completely transformed how I approach data stories. What used to take me hours in Excel and design tools now takes minutes. The AI suggestions are incredibly smart and often catch patterns I might have missed.',
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Senior Editor',
      organization: 'TechCrunch',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'The embed feature is a game-changer. Our charts load instantly on the site and look perfect on mobile. The fact that they\'re responsive and accessible out of the box saves our dev team countless hours.',
      rating: 5,
      featured: false
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      organization: 'Climate Analytics Institute',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'As someone who publishes research findings regularly, I need charts that are both accurate and compelling. DataColumn.ai delivers on both fronts, with beautiful designs that never compromise the data integrity.',
      rating: 5,
      featured: true
    },
    {
      id: 4,
      name: 'James Thompson',
      role: 'Freelance Journalist',
      organization: 'Independent',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'Working solo, I don\'t have a design team to create visuals. DataColumn.ai gives me professional-quality charts that make my stories stand out. The AI even suggests better ways to present my data.',
      rating: 5,
      featured: false
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Digital Content Manager',
      organization: 'Reuters',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'Our team creates dozens of charts weekly for breaking news. DataColumn.ai\'s speed and consistency are unmatched. We can go from raw data to published chart in under 10 minutes.',
      rating: 5,
      featured: true
    },
    {
      id: 6,
      name: 'David Kim',
      role: 'Economics Correspondent',
      organization: 'Financial Times',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'The multilingual support is incredible for our global audience. I can create a chart in English and instantly generate versions in Spanish, French, and Mandarin without losing any formatting.',
      rating: 5,
      featured: false
    }
  ];

  const asset = (file) => {
      const page = usePage()
      return `${page.props.base_url}/${file}`
  }
  // const CurrentThemeIcon = getCurrentThemeIcon();

  return (
      <AppearanceProvider>

          <Head>
              {/* Basic Meta Tags */}
              <title>DataColumn.ai - AI-Powered Data Visualization for Journalists</title>
              <meta name="description" content="Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights." />
              <meta name="keywords" content="data visualization, AI charts, journalism tools, data analysis, business intelligence, infographics, data storytelling, chart maker" />

              {/* Twitter Card */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="DataColumn.ai - AI-Powered Data Visualization for Journalists" />
              <meta name="twitter:description" content="Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights." />
              <meta name="twitter:image" content={asset('logo.svg')} />
              <meta name="twitter:creator" content="@datacolumnai" />
              <meta name="twitter:site" content="@datacolumnai" />

              {/* Structured Data */}
              <script type="application/ld+json">
                  {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "DataColumn.ai",
                      "description": "Create professional data visualizations with AI assistance. Perfect for journalists, analysts, and content creators. Support for multiple chart types, CSV import, and intelligent insights.",
                      "url": "https://datacolumn.ai",
                      "applicationCategory": "BusinessApplication",
                      "operatingSystem": "Web",
                      "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD",
                          "availability": "https://schema.org/InStock"
                      },
                      "creator": {
                          "@type": "Organization",
                          "name": "DataColumn.ai",
                          "url": "https://datacolumn.ai"
                      },
                      "screenshot": asset('logo.svg'),
                      "featureList": [
                          "AI-powered chart creation",
                          "Multiple chart types",
                          "CSV data import",
                          "Real-time collaboration",
                          "Professional exports",
                          "Embed generation"
                      ]
                  })}
              </script>
          </Head>



      <div className="min-h-screen bg-background transition-colors duration-300 relative">
        {/* Animated Background Charts - FIXED Z-INDEX */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Bar Chart Background - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -100, y: -50 }}
            animate={{ opacity: 0.08, x: 0, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-20 left-10 w-80 h-64 z-10"
          >
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <defs>
                <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <g>
                <motion.rect
                  x="40" y="120" width="35" height="70"
                  fill="url(#barGradient1)"
                  initial={{ height: 0, y: 190 }}
                  animate={{ height: 70, y: 120 }}
                  transition={{ duration: 1.2, delay: 1 }}
                />
                <motion.rect
                  x="85" y="90" width="35" height="100"
                  fill="url(#barGradient1)"
                  initial={{ height: 0, y: 190 }}
                  animate={{ height: 100, y: 90 }}
                  transition={{ duration: 1.2, delay: 1.3 }}
                />
                <motion.rect
                  x="130" y="60" width="35" height="130"
                  fill="url(#barGradient1)"
                  initial={{ height: 0, y: 190 }}
                  animate={{ height: 130, y: 60 }}
                  transition={{ duration: 1.2, delay: 1.6 }}
                />
                <motion.rect
                  x="175" y="100" width="35" height="90"
                  fill="url(#barGradient1)"
                  initial={{ height: 0, y: 190 }}
                  animate={{ height: 90, y: 100 }}
                  transition={{ duration: 1.2, delay: 1.9 }}
                />
                <motion.rect
                  x="220" y="80" width="35" height="110"
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
            className="absolute top-32 right-16 w-96 h-72 z-10"
          >
            <svg viewBox="0 0 400 250" className="w-full h-full">
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
                  { x: 350, y: 110, delay: 3.8 }
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
            className="absolute bottom-32 left-20 w-64 h-64 z-10"
          >
            <svg viewBox="0 0 160 160" className="w-full h-full">
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
            className="absolute bottom-20 right-32 w-72 h-48 z-10"
          >
            <svg viewBox="0 0 280 160" className="w-full h-full">
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
                  { x: 240, y: 55, delay: 4.2, size: 7, color: '#8b5cf6' }
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
            className="absolute top-1/2 left-1/4 w-40 h-40 z-10"
          >
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <g>
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 3 }}
                />
                <motion.circle
                  cx="60" cy="60" r="30"
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
            className="absolute top-3/4 right-1/4 w-56 h-32 z-10"
          >
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <g>
                <motion.rect
                  x="20" y="70" width="12" height="25"
                  fill="#ec4899"
                  fillOpacity="0.5"
                  initial={{ height: 0 }}
                  animate={{ height: 25 }}
                  transition={{ duration: 1, delay: 4.5 }}
                />
                <motion.rect
                  x="40" y="50" width="12" height="45"
                  fill="#ec4899"
                  fillOpacity="0.5"
                  initial={{ height: 0 }}
                  animate={{ height: 45 }}
                  transition={{ duration: 1, delay: 4.7 }}
                />
                <motion.rect
                  x="60" y="35" width="12" height="60"
                  fill="#ec4899"
                  fillOpacity="0.5"
                  initial={{ height: 0 }}
                  animate={{ height: 60 }}
                  transition={{ duration: 1, delay: 4.9 }}
                />
                <motion.rect
                  x="80" y="45" width="12" height="50"
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
            className="absolute top-1/3 right-1/3 w-32 h-32 z-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <g>
                {[
                  { x: 20, y: 30, delay: 5, color: '#06b6d4' },
                  { x: 50, y: 20, delay: 5.2, color: '#84cc16' },
                  { x: 80, y: 40, delay: 5.4, color: '#f59e0b' },
                  { x: 30, y: 60, delay: 5.6, color: '#ef4444' },
                  { x: 70, y: 70, delay: 5.8, color: '#8b5cf6' }
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
          <Header/>

        {/* Hero Section */}
        <section className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
            >
              Turn data into story-ready charts,{' '}
              <br className="hidden sm:block" />
              <span className="text-primary/90 dark:text-blue-400">In seconds.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-secondary-foreground dark:text-primary-foreground/80 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
            >
              DataColumn.ai helps journalists create clean, embeddable visualizations using AI.
              No clutter. No code. Just clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                href={route('pricing')}
                className="flex items-center space-x-2 bg-primary/90 hover:bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Get Started Free</span>
              </Link>
              <Link
                href={route('login')}
                className="flex items-center space-x-2 border border-border hover:border-muted-foreground text-foreground/90 hover:text-foreground bg-card px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 bg-background/50 backdrop-blur-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Chart Types */}
        <section className="py-12 sm:py-16 bg-primary-foreground dark:bg-gray-800 backdrop-blur-sm transition-colors duration-300 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Stunning charts, graphs and plots
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {chartTypes.map((chart, index) => {
                // Special case for the last item on mobile (Stacked Area)
                const isLastItem = index === chartTypes.length - 1;
                const mobileClasses = isLastItem ? 'col-span-2 sm:col-span-1' : '';

                return (
                  <motion.div
                    key={chart.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`text-center ${mobileClasses}`}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
                      <chart.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{chart.name}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 sm:py-20 relative z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Built for the newsroom, not the dashboard.
            </h2>
            <p className="text-lg sm:text-xl text-secondary-foreground dark:text-primary-foreground/80 mb-8 sm:mb-12">
              Other data visualization tools are made for analysts. DataColumn.ai is built by journalists for journalists.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
              <div className="bg-background dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border transition-colors duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Type className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Describe your chart in plain English
                </h3>
                <p className="text-sm sm:text-base text-secondary-foreground dark:text-primary-foreground/80">
                  Tell our AI what you want to visualize and watch it create the perfect chart.
                </p>
              </div>

              <div className="bg-background dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border transition-colors duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-chart-2" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Upload, paste, or link your data
                </h3>
                <p className="text-sm sm:text-base text-secondary-foreground dark:text-primary-foreground/80">
                  Import from CSV, Google Sheets, or paste directly. We handle the rest.
                </p>
              </div>

              <div className="bg-background dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border transition-colors duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-gradient-to" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Get polished, responsive charts
                </h3>
                <p className="text-sm sm:text-base text-secondary-foreground dark:text-primary-foreground/80">
                  Publication-ready visualizations that look great everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 sm:py-20 bg-primary-foreground dark:bg-gray-800 backdrop-blur-sm transition-colors duration-300 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Key Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-border transition-colors duration-300"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-foreground dark:text-primary-foreground/80 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-24 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Trusted by Journalists Worldwide
                </h2>
                <p className="text-lg sm:text-xl text-secondary-foreground dark:text-primary-foreground/80 max-w-3xl mx-auto">
                  See how DataColumn.ai is transforming data storytelling for newsrooms and content creators.
                </p>
              </motion.div>
            </div>

            {/* Featured Testimonials */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {testimonials.filter(t => t.featured).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-background dark:bg-gray-800/90 rounded-xl shadow-xl p-6 sm:p-8 border border-border relative"
                >
                  <div className="absolute top-6 right-6 text-primary">
                    <Quote className="w-8 h-8 opacity-20" />
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-secondary-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary">{testimonial.organization}</p>
                    </div>
                  </div>

                  <p className="text-secondary-foreground dark:text-primary-foreground/80 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-primary fill-current"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.filter(t => !t.featured).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-background dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-5 border border-border"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.organization}</p>
                    </div>
                  </div>

                  <p className="text-sm text-secondary-foreground dark:text-primary-foreground/80 mb-3 line-clamp-4">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-primary fill-current"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 relative z-20 bg-background dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Ready to create your first chart?
            </h2>
            <p className="text-lg sm:text-xl text-secondary-foreground dark:text-primary-foreground/80 mb-6 sm:mb-8">
              Start free — no credit card required.
            </p>

            <Link
              href={route('pricing')}
              className="flex items-center w-fit space-x-2 bg-primary/90 hover:bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 mx-auto shadow-lg hover:shadow-xl"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Get Started Free</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground dark:bg-gray-950 text-primary-foreground py-8 sm:py-12 transition-colors duration-300 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Logo showText={false} className="w-8 h-8" />
                <Link href={route('home')}><span className="text-lg sm:text-xl font-bold">DataColumn.ai</span></Link>
              </div>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link
                    href={route('pricing')}
                  className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                >
                  Pricing
                </Link>
                <button
                  // onClick={() => navigate('/faq')}
                  className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                >
                  FAQ
                </button>
                <Link
                    href={route('login')}
                  // onClick={handleSignIn}
                  className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/10 dark:border-border text-center text-primary-foreground/80 text-sm">
                <p>&copy; 2025 <Link href={route('home')}>DataColumn.ai</Link>. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
        </AppearanceProvider>
  );
};
