export interface CustomChartConfig {
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
    series: object[];
    grid: object;
    tooltip: string[];
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
