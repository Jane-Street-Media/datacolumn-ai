import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    RadarChart,
    Radar,
    RadialBarChart,
    RadialBar,
    FunnelChart,
    Funnel,
    Treemap,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ReferenceLine,
    LabelList,
} from 'recharts';
import { ChartConfig, DataPoint } from '../types';
import { useChartEditor } from '@/contexts/chart-editor-context';

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label, config }: TooltipProps<number, string> & { config: ChartConfig }) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = (value: number | string) => {
      if (typeof value === 'string'){
          value = Number(value)
      }

    switch (config.tooltipFormat) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'thousands':
        return `${(value / 1000).toFixed(1)}K`;
      case 'millions':
        return `${(value / 1000000).toFixed(1)}M`;
      case 'custom':
        if (config.tooltipCustomFormat) {
          return config.tooltipCustomFormat.replace('{value}', value.toString());
        }
        return value.toString();
      default:
        return value.toString();
    }
  };

  // Determine tooltip theme based on chart theme
  const isDarkTheme = config.theme === 'dark' ||
                     (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} p-3 border rounded-lg shadow-lg`}>
      <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-1`}>{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            {entry.name}: {formatValue(entry.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom Waterfall Tooltip
const WaterfallTooltip = ({ active, payload, label, config }: TooltipProps<number, string> & { config: ChartConfig }) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = (value: number | string) => {
    if (typeof value === 'string'){
      value = Number(value)
    }
    switch (config.tooltipFormat) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'thousands':
        return `${(value / 1000).toFixed(1)}K`;
      case 'millions':
        return `${(value / 1000000).toFixed(1)}M`;
      default:
        return value.toString();
    }
  };

  const isDarkTheme = config.theme === 'dark' ||
                     (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const data = payload[0]?.payload;

  return (
    <div className={`${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} p-3 border rounded-lg shadow-lg`}>
      <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-2`}>{label}</p>
      <div className="space-y-1">
        <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Change: {formatValue(data?.originalValue || 0)}
        </div>
        <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          Running Total: {formatValue(data?.runningTotal || 0)}
        </div>
      </div>
    </div>
  );
};

export const ChartRenderer: React.FC = () => {
    const { config, data } = useChartEditor();

    // Basic data validation
    const hasValidData = data && data.length;
    const hasValidSeries = config.series && config.series.length > 0;

    // Get first series for single-series charts
    const firstSeries = hasValidSeries ? config.series[0] : null;
    const firstSeriesKey = firstSeries?.dataKey || 'value';

    // Common chart data - just pass through
    const chartData = useMemo(() => {
        if (!hasValidData) return [];
        return data;
    }, [data, hasValidData]);

    // Specific data transformations
    const transformedData = useMemo(() => {
        if (!hasValidData || !hasValidSeries) return { pie: [], radar: [], radialBar: [], funnel: [], treemap: [], scatter: [], waterfall: [] };

        const result = {
            // Pie chart data
            pie: chartData.map((item, index) => ({
                name: item[config.xAxis] || `Item ${index + 1}`,
                value: Number(item[firstSeriesKey] || 0),
                fill: config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`
            })).filter(item => item.value > 0),

            // Radar chart data
            radar: chartData.map(item => {
                const result = { [config.xAxis]: item[config.xAxis] };
                config.series.forEach(series => {
                    result[series.dataKey] = Number(item[series.dataKey] || 0);
                });
                return result;
            }),

            // Radial bar data
            radialBar: (() => {
                const maxValue = Math.max(...chartData.map(item => Number(item[firstSeriesKey] || 0)));
                return chartData.map((item, index) => ({
                    name: item[config.xAxis] || `Item ${index + 1}`,
                    value: Number(item[firstSeriesKey] || 0),
                    percentage: maxValue > 0 ? Math.round((Number(item[firstSeriesKey] || 0) / maxValue) * 100) : 0,
                    fill: config.colors?.[index % config.colors.length] || '#8884d8'
                }));
            })(),

            // Funnel data
            funnel: (() => {
                const totalValue = chartData.reduce((sum, item) => sum + Number(item[firstSeriesKey] || 0), 0);
                return chartData.map((item, index) => ({
                    name: item[config.xAxis] || `Stage ${index + 1}`,
                    value: Number(item[firstSeriesKey] || 0),
                    percentage: totalValue > 0 ? Math.round((Number(item[firstSeriesKey] || 0) / totalValue) * 100) : 0,
                    fill: config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`
                })).sort((a, b) => b.value - a.value);
            })(),

            // Treemap data
            treemap: chartData.map((item, index) => ({
                name: item[config.xAxis] || `Item ${index + 1}`,
                size: Number(item[firstSeriesKey] || 0),
                value: Number(item[firstSeriesKey] || 0),
                fill: config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`
            })).filter(item => item.size > 0),

            // Scatter data
            scatter: chartData.map(item => ({
                x: Number(item[config.xAxis] || 0),
                y: Number(item[firstSeriesKey] || 0),
                name: item[config.xAxis] || 'Point'
            })),

            // Waterfall data
            waterfall: (() => {
                let runningTotal = 0;
                return chartData.map((item, index) => {
                    const originalValue = Number(item[firstSeriesKey] || 0);
                    const isPositive = originalValue >= 0;
                    const startValue = isPositive ? runningTotal : runningTotal + originalValue;
                    runningTotal += originalValue;

                    return {
                        ...item,
                        [config.xAxis]: item[config.xAxis],
                        base: startValue,
                        value: Math.abs(originalValue),
                        originalValue: originalValue,
                        runningTotal: runningTotal,
                        isPositive: isPositive
                    };
                });
            })()
        };

        return result;
    }, [chartData, config, hasValidData, hasValidSeries, firstSeriesKey]);

    if (!hasValidData) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-8">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Chart Preview</h3>
                <p className="text-secondary-foreground text-center">Configure your chart settings and select data columns to see the visualization</p>
            </div>
        );
    }

    if (!hasValidSeries) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-8">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Add Data Series</h3>
                <p className="text-secondary-foreground text-center">Please select at least one Y-axis data series to create your chart</p>
            </div>
        );
    }

    // Chart configuration - FIXED to truly respect padding options
    const getChartMargin = () => {
        if (config.paddingOption === 'none') {
            return { top: 0, right: 0, left: 0, bottom: 0 };
        } else if (config.paddingOption === 'custom') {
            const padding = parseInt(config.customPaddingValue) || 0;
            return { top: padding, right: padding, left: padding, bottom: padding };
        } else if (config.paddingOption === 'small') {
            return { top: 10, right: 10, left: 10, bottom: 10 };
        }
        // Default padding
        return { top: 20, right: 30, left: 20, bottom: 70 };
    };

    const getAnimationProps = () => ({
        isAnimationActive: config.enableAnimation !== false,
        animationDuration: config.animationDuration || 1000
    });

    // Get responsive dimensions for circular charts
    const getCircularChartRadius = (outerRadiusPercent = 85, innerRadiusPercent = 0) => {
        return {
            outerRadius: `${outerRadiusPercent}%`,
            innerRadius: `${innerRadiusPercent}%`
        };
    };

    const commonProps = {
        data: chartData,
        margin: getChartMargin(),
    };

    const isDarkTheme = config.theme === 'dark' || (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Grid configuration
    const gridConfig = {
        strokeDasharray: "3 3",
        stroke: isDarkTheme ? '#374151' : '#e5e7eb'
    };

    // Axis props
    const xAxisProps = config.showXAxis ? {} : { axisLine: false, tickLine: false, hide: true };
    const yAxisProps = config.showYAxis ? {} : { axisLine: false, tickLine: false, hide: true };

    // Legend props
    const legendProps = config.showLegend ? {
        wrapperStyle: { paddingTop: '20px' },
        verticalAlign: config.legendPosition === 'top' || config.legendPosition === 'bottom' ? config.legendPosition : 'bottom',
        align: config.legendPosition === 'left' || config.legendPosition === 'right' ? config.legendPosition : 'center',
        layout: config.legendPosition === 'left' || config.legendPosition === 'right' ? 'vertical' : 'horizontal'
    } : {};

    const animationProps = getAnimationProps();

    const renderChart = () => {
        switch (config.type) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Bar
                                key={seriesData.dataKey}
                                dataKey={seriesData.dataKey}
                                fill={seriesData.fill || config.colors[index % config.colors.length]}
                                radius={[4, 4, 0, 0]}
                                {...animationProps}
                            />
                        ))}
                    </BarChart>
                );

            case 'stackedBar':
                return (
                    <BarChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Bar
                                key={seriesData.dataKey}
                                dataKey={seriesData.dataKey}
                                stackId="stack"
                                fill={seriesData.fill || config.colors[index % config.colors.length]}
                                {...animationProps}
                            />
                        ))}
                    </BarChart>
                );

            case 'line':
                return (
                    <LineChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Line
                                key={seriesData.dataKey}
                                type="monotone"
                                dataKey={seriesData.dataKey}
                                stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                {...animationProps}
                            />
                        ))}
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Area
                                key={seriesData.dataKey}
                                type="monotone"
                                dataKey={seriesData.dataKey}
                                stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                fill={seriesData.fill || config.colors[index % config.colors.length]}
                                fillOpacity={0.6}
                                {...animationProps}
                            />
                        ))}
                    </AreaChart>
                );

            case 'stackedArea':
                return (
                    <AreaChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Area
                                key={seriesData.dataKey}
                                type="monotone"
                                dataKey={seriesData.dataKey}
                                stackId="stack"
                                stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                fill={seriesData.fill || config.colors[index % config.colors.length]}
                                fillOpacity={0.6}
                                {...animationProps}
                            />
                        ))}
                    </AreaChart>
                );

            case 'pie':
                const pieData = transformedData.pie;
                const pieOuterRadius = `${config.outerRadius || 85}%`;
                
                const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="bold"
                        >
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                };

                // Pie chart props - only add innerRadius if it's actually specified and > 0
                const pieProps = {
                    data: pieData,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    labelLine: false,
                    label: renderPieLabel,
                    outerRadius: pieOuterRadius,
                    ...animationProps,
                    ...(config.innerRadius && config.innerRadius > 0 && {
                        innerRadius: `${config.innerRadius}%`
                    })
                };

                return (
                    <PieChart {...commonProps}>
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        <Pie {...pieProps}>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                );

            case 'scatter':
                return (
                    <ScatterChart {...commonProps} data={transformedData.scatter}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey="x" type="number" name={config.xAxisLabel || config.xAxis} {...xAxisProps} />
                        <YAxis dataKey="y" type="number" name={config.yAxisLabel || firstSeriesKey} {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} cursor={{ strokeDasharray: '3 3' }} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        <Scatter
                            name={firstSeriesKey}
                            data={transformedData.scatter}
                            fill={config.colors[0] || '#8884d8'}
                            {...animationProps}
                        />
                    </ScatterChart>
                );

            case 'radar':
                return (
                    <RadarChart {...commonProps} data={transformedData.radar}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey={config.xAxis} />
                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => (
                            <Radar
                                key={seriesData.dataKey}
                                name={seriesData.dataKey}
                                dataKey={seriesData.dataKey}
                                stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                fill={seriesData.fill || config.colors[index % config.colors.length]}
                                fillOpacity={0.3}
                                strokeWidth={2}
                                {...animationProps}
                            />
                        ))}
                    </RadarChart>
                );

            case 'radialBar':
                const radialRadius = getCircularChartRadius(config.outerRadius || 80, config.innerRadius || 10);
                return (
                    <RadialBarChart {...commonProps} data={transformedData.radialBar} innerRadius={radialRadius.innerRadius} outerRadius={radialRadius.outerRadius}>
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        <RadialBar
                            dataKey="percentage"
                            cornerRadius={10}
                            startAngle={config.startAngle || 90}
                            endAngle={config.endAngle || 450}
                            {...animationProps}
                        >
                            {transformedData.radialBar.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </RadialBar>
                    </RadialBarChart>
                );

            case 'funnel':
                return (
                    <FunnelChart {...commonProps}>
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        <Funnel
                            dataKey="value"
                            data={transformedData.funnel}
                            isAnimationActive={config.enableAnimation !== false}
                            animationDuration={config.animationDuration || 1000}
                        >
                            <LabelList position="center" fill="#fff" stroke="none" dataKey="name" />
                        </Funnel>
                    </FunnelChart>
                );

            case 'treemap':
                return (
                    <Treemap
                        {...commonProps}
                        data={transformedData.treemap}
                        dataKey="value"
                        aspectRatio={config.aspectRatio || 4/3}
                        stroke="#fff"
                        strokeWidth={2}
                        {...animationProps}
                    >
                        {transformedData.treemap.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Treemap>
                );

            case 'waterfall':
                return (
                    <BarChart {...commonProps} data={transformedData.waterfall}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <WaterfallTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        <Bar dataKey="base" stackId="waterfall" fill="transparent" {...animationProps} />
                        <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]} {...animationProps}>
                            {transformedData.waterfall.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isPositive ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    </BarChart>
                );

            case 'composed':
                return (
                    <ComposedChart {...commonProps}>
                        {config.showGrid && <CartesianGrid {...gridConfig} />}
                        <XAxis dataKey={config.xAxis} {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                        {config.showLegend && <Legend {...legendProps} />}
                        {config.series.map((seriesData, index) => {
                            if (seriesData.chartType === 'line') {
                                return (
                                    <Line
                                        key={seriesData.dataKey}
                                        type="monotone"
                                        dataKey={seriesData.dataKey}
                                        stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                        {...animationProps}
                                    />
                                );
                            } else if (seriesData.chartType === 'area') {
                                return (
                                    <Area
                                        key={seriesData.dataKey}
                                        type="monotone"
                                        dataKey={seriesData.dataKey}
                                        stroke={seriesData.stroke || config.colors[index % config.colors.length]}
                                        fill={seriesData.fill || config.colors[index % config.colors.length]}
                                        fillOpacity={0.6}
                                        {...animationProps}
                                    />
                                );
                            } else {
                                return (
                                    <Bar
                                        key={seriesData.dataKey}
                                        dataKey={seriesData.dataKey}
                                        fill={seriesData.fill || config.colors[index % config.colors.length]}
                                        radius={[4, 4, 0, 0]}
                                        {...animationProps}
                                    />
                                );
                            }
                        })}
                    </ComposedChart>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Chart type not supported: {config.type}</p>
                    </div>
                );
        }
    };

    const getTitleAlignment = () => {
        switch (config.titleAlignment) {
            case 'left': return 'text-left';
            case 'right': return 'text-right';
            case 'center':
            default: return 'text-center';
        }
    };

    // Determine background color
    let bgColorClass = isDarkTheme ? 'bg-gray-900' : 'bg-white';
    let bgColorStyle = {};

    if (config.backgroundColor === 'transparent') {
        bgColorClass = 'bg-transparent';
    } else if (config.backgroundColor && config.backgroundColor !== 'default') {
        bgColorClass = '';
        bgColorStyle = { backgroundColor: config.backgroundColor };
    }

    // Container padding - respect the padding settings for the entire container
    const getContainerPadding = () => {
        if (config.paddingOption === 'none') {
            return 'p-0';
        } else if (config.paddingOption === 'small') {
            return 'py-2 px-1';
        } else if (config.paddingOption === 'custom') {
            const padding = parseInt(config.customPaddingValue) || 0;
            return `p-${Math.min(padding / 4, 12)}`; // Convert to Tailwind classes (approximate)
        }
        return 'py-8 px-4'; // default
    };

    // Title padding - also respect padding settings
    const getTitlePadding = () => {
        if (config.paddingOption === 'none') {
            return 'px-0 mb-0';
        } else if (config.paddingOption === 'small') {
            return 'px-2 mb-1';
        }
        return 'px-10 mb-4'; // default
    };

    return (
        <div
            className={`rounded-lg ${getContainerPadding()} ${bgColorClass}`}
            id="chart-container"
            style={bgColorStyle}
        >
            {/* Title */}
            {config.title && (
                <div className={`${getTitlePadding()} ${getTitleAlignment()}`}>
                    <h2
                        className={`text-2xl mb-0.5 ${
                            config.titleWeight === 'bold' ? 'font-bold' :
                            config.titleWeight === 'light' ? 'font-light' :
                            config.titleWeight === 'semibold' ? 'font-semibold' :
                            'font-normal'
                        }`}
                        style={{ color: config.titleColor, fontSize: config.titleSize || '1rem' }}
                    >
                        {config.title}
                    </h2>
                    {/* Subtitle */}
                    {config.subtitle && (
                        <p
                            className="text-lg opacity-80"
                            style={{ color: config.subtitleColor, fontSize: config.subtitleSize || '0.9rem' }}
                        >
                            {config.subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Chart */}
            <ResponsiveContainer width="100%" height={config.height || 400}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};
