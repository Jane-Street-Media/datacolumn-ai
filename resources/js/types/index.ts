import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    isVisible?: true
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    subscription: any;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Stat {
    name: string;
    value: number;
    change?: number;
    icon?: LucideIcon | null;
}

// Enhanced chart types
export type ChartType = 
    | 'bar' 
    | 'line' 
    | 'area' 
    | 'pie' 
    | 'scatter' 
    | 'radar' 
    | 'radialBar' 
    | 'funnel' 
    | 'treemap' 
    | 'composed' 
    | 'stackedBar' 
    | 'stackedArea' 
    | 'waterfall';

// Series configuration for multi-series and composed charts
export interface SeriesConfig {
    dataKey: string;
    chartType: ChartType;
    type?: 'monotone' | 'basis' | 'linear' | 'natural' | 'step' | 'stepBefore' | 'stepAfter';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    stackId?: string;
    connectNulls?: boolean;
    dot?: boolean | object;
    activeDot?: boolean | object;
    label?: boolean | object;
    hide?: boolean;
}

export interface ChartConfig {
    type: ChartType;
    title: string;
    titleAlignment: 'left' | 'center' | 'right';
    titleColor: string;
    titleWeight: 'normal' | 'bold' | 'light' | 'semibold';
    subtitle: string;
    subtitleColor: string;
    
    // Axis configuration
    xAxis: string;
    yAxis: string; // Keep for backward compatibility
    xAxisLabel: string;
    yAxisLabel: string;
    
    // Series configuration (new multi-series support)
    series: SeriesConfig[];
    
    // Tooltip configuration
    tooltipFormat: 'default' | 'currency' | 'percentage' | 'decimal' | 'thousands' | 'millions' | 'custom';
    tooltipCustomFormat?: string;
    showTooltip: boolean;
    
    // Colors and styling
    colors: string[];
    
    // Grid and display options
    showGrid: boolean;
    grid: ChartGrid;
    showLegend: boolean;
    legendPosition: 'top' | 'bottom' | 'left' | 'right';
    showXAxis: boolean;
    showYAxis: boolean;
    showCartesianGrid: boolean;
    
    // Dimensions
    width: number;
    height: number;
    
    // Padding
    paddingOption: 'none' | 'default' | 'custom';
    customPaddingValue?: number;
    
    // Theme
    theme: 'light' | 'dark' | 'system';
    backgroundColor?: 'default' | 'transparent' | string;
    
    // Animation settings
    enableAnimation: boolean;
    animationDuration: number;
    animationType: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    
    // Chart-specific options for special chart types
    // Pie/Radial chart options
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    dataKey?: string; // For pie/treemap charts
    nameKey?: string; // For pie charts
    valueKey?: string; // For treemap charts
    
    // Radar specific
    radarKeys?: string[];
    
    // Treemap specific
    aspectRatio?: number;
    
    // Funnel specific
    funnelWidth?: number;
    funnelHeight?: number;
    
    // Waterfall specific
    waterfallStartValue?: number;
    waterfallEndValue?: number;
}

export interface ChartGrid {
    vertical: true,
    horizontal: true,
    stroke: '#e0e0e0',
    strokeDasharray: '3 3',
    fill: '#fafafa',
    strokeWidth: 1,
}

// Data interfaces
export interface DataPoint {
    [key: string]: any;
}

export interface ChartData {
    [key: string]: any;
}

// For backward compatibility, create an alias
export type CustomChartConfig = ChartConfig;
