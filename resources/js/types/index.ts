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

export interface ChartConfig {
    type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'radialBar' | 'funnel' | 'treemap' | 'composed';
    title: string;
    titleAlignment: 'left' | 'center' | 'right';
    titleColor: string;
    titleWeight: 'normal' | 'bold';
    subtitle: string;
    subtitleColor: string;
    xAxis: string;
    yAxis: string;
    xAxisLabel: string;
    yAxisLabel: string;
    tooltipFormat: 'default' | 'currency' | 'percentage' | 'decimal' | 'custom';
    tooltipCustomFormat?: string;
    colors: string[];
    showGrid: boolean;
    showLegend: boolean;
    showXAxis: boolean;
    showYAxis: boolean;
    width: number;
    height: number;
    paddingOption: 'none' | 'default' | 'custom';
    customPaddingValue?: number;
    theme: 'light' | 'dark' | 'system';
    backgroundColor?: 'default' | 'transparent' | string;
}
