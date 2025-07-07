import { motion } from 'framer-motion';

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
import { Link } from '@inertiajs/react';
import HomeLayout from '@/layouts/home-layout';
import Pricing from '@/pages/pricing/guest-pricing';

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
// const CurrentThemeIcon = getCurrentThemeIcon();

export default function LandingPage({ plans }) {

  return (
      <HomeLayout>
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

          <Pricing plans={plans} />

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
      </HomeLayout>
  );
};
