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

// Custom content component for Treemap
const CustomTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={12}>
          {name}
        </text>
      ) : null}
      {depth === 1 && value ? (
        <text x={x + width / 2} y={y + height / 2 + 25} textAnchor="middle" fill="#fff" fontSize={10}>
          {value}
        </text>
      ) : null}
    </g>
  );
};

export const ChartRenderer: React.FC = () => {

    const { config, data } = useChartEditor();

  // Memoize the processed data to avoid unnecessary recalculations
  const chartData = useMemo(() => {
      if (!data.length || !config.xAxis) {
      return [];
    }

      return data.map(item => ({
      ...item,
    }));
  }, [data, config.xAxis, config.yAxis]);

  // Transform data for waterfall chart
  const waterfallData = useMemo(() => {
    if (config.type !== 'waterfall' || !chartData.length || !config.series.length) {
      return chartData;
    }
    
    let runningTotal = 0;
    const valueKey = config.series[0]?.dataKey;
    
    return chartData.map((item, index) => {
      const originalValue = Number(item[valueKey] || 0);
      const isPositive = originalValue >= 0;
      
      // For positive values, start from running total
      // For negative values, start from running total + value
      const startValue = isPositive ? runningTotal : runningTotal + originalValue;
      const endValue = runningTotal + originalValue;
      
      runningTotal += originalValue;
      
      return {
        ...item,
        [config.xAxis]: item[config.xAxis],
        // Invisible bar to position the visible bar correctly
        base: startValue,
        // The visible bar value
        value: Math.abs(originalValue),
        // Store original for tooltip
        originalValue: originalValue,
        runningTotal: runningTotal,
        isPositive: isPositive,
        fill: isPositive ? '#22c55e' : '#ef4444' // Green for positive, red for negative
      };
    });
  }, [chartData, config.type, config.series, config.xAxis]);

  if (!data.length || !config.xAxis) {
    return (
      <div className="bg-background text-foreground">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Chart Preview</h3>
        <p className="text-secondary-foreground">Configure your chart settings and select data columns to see the visualization</p>
      </div>
    );
  }

  // Determine chart padding based on paddingOption
  const getChartMargin = () => {
    if (!config.paddingOption || config.paddingOption === 'default') {
      return { top: 20, right: 30, left: 20, bottom: 70 };
    } else if (config.paddingOption === 'none') {
      return { top: 0, right: 0, left: 0, bottom: 70 };
    } else if (config.paddingOption === 'custom') {
      const padding = parseInt(config.customPaddingValue) || 0;
      return { top: padding, right: padding, left: padding, bottom: (padding+70) };
    }
    return { top: 20, right: 30, left: 20, bottom: 200 };
  };

  // Animation props
  const getAnimationProps = () => {
    if (config.enableAnimation === false) {
      return { isAnimationActive: false };
    }
    return {
      isAnimationActive: true,
      animationDuration: config.animationDuration || 1000,
      animationEasing: config.animationType || 'ease'
    };
  };

  const renderChart = () => {
    const commonProps = {
      data: config.type === 'waterfall' ? waterfallData : chartData,
      margin: getChartMargin(),
    };

    // Axis props based on config
    const xAxisProps = config.showXAxis ? {} : { axisLine: false, tickLine: false };
    const yAxisProps = config.showYAxis ? {} : { axisLine: false, tickLine: false };

    // Add axis labels if provided
    if (config.xAxisLabel) {
      xAxisProps.label = {
        value: config.xAxisLabel,
        position: 'insideBottom',
        offset: -50,
        style: { textAnchor: 'middle', fill: '#666' }
      };
    }

    if (config.yAxisLabel) {
      yAxisProps.label = {
        value: config.yAxisLabel,
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle', fill: '#666' }
      };
    }

      // Determine if we should use dark theme
      const isDarkTheme = config.theme === 'dark' ||
          (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      // Determine background color
      config.grid.fill = isDarkTheme ? '#1E2939FF' : '#ffffff';

      if (config.backgroundColor === 'transparent') {
          config.grid.fill = '';
      } else if (config.backgroundColor && config.backgroundColor !== 'default') {
          config.grid.fill = config.backgroundColor;
      }

      // Legend props
      const legendProps = config.showLegend ? {
        wrapperStyle: { paddingTop: '20px' },
        verticalAlign: config.legendPosition === 'top' || config.legendPosition === 'bottom' ? config.legendPosition : 'bottom',
        align: config.legendPosition === 'left' || config.legendPosition === 'right' ? config.legendPosition : 'center',
        layout: config.legendPosition === 'left' || config.legendPosition === 'right' ? 'vertical' : 'horizontal'
      } : {};

      const animationProps = getAnimationProps();

      switch (config.type) {
      case 'bar':
      case 'stackedBar':
        return (
            <BarChart {...commonProps}>
                {config.showGrid && <CartesianGrid {...config.grid} />}
                <XAxis dataKey={config.xAxis} {...xAxisProps} />
                <YAxis {...yAxisProps} />
                {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                {config.showLegend && <Legend {...legendProps} />}
                {config.series?.length ? config.series.map((seriesData) => (
                  <Bar 
                    key={seriesData.dataKey} 
                    {...seriesData} 
                    stackId={config.type === 'stackedBar' ? 'stack' : undefined}
                    radius={config.type === 'stackedBar' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                    {...animationProps}
                  />
                )) : (<Bar dataKey={config.yAxis} radius={[4, 4, 0, 0]} {...animationProps} />)}
            </BarChart>
        );

      case 'line':
        return (
            <LineChart {...commonProps}>
                {config.showGrid && <CartesianGrid {...config.grid} />}
                <XAxis dataKey={config.xAxis} {...xAxisProps} />
                <YAxis {...yAxisProps} />
                {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
                {config.showLegend && <Legend {...legendProps} />}
                {config.series?.length ? (
                    config.series.map((seriesData) => (
                      <Line 
                        key={seriesData.dataKey} 
                        {...seriesData} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        {...animationProps}
                      />
                    ))
                ) : (
                    <Line 
                      type="monotone" 
                      dataKey={config.yAxis} 
                      stroke={config.colors[0]} 
                      strokeWidth={2} 
                      dot={{ fill: config.colors[0] }} 
                      {...animationProps}
                    />
                )}
            </LineChart>
        );

      case 'area':
      case 'stackedArea':
        return (
          <AreaChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
              {config.showLegend && <Legend {...legendProps} />}
              {config.series?.length ? (
                  config.series.map((seriesData) => (
                      <Area 
                        key={seriesData.dataKey} 
                        {...seriesData} 
                        type="monotone"
                        stackId={config.type === 'stackedArea' ? 'stack' : undefined}
                        fillOpacity={seriesData.fillOpacity || 0.6}
                        {...animationProps}
                      />
                  ))) : (
                  <Area
                      type="monotone"
                      dataKey={config.yAxis}
                      stroke={config.colors[0]}
                      fill={config.colors[0]}
                      fillOpacity={0.6}
                      {...animationProps}
                  />
              )}
          </AreaChart>
        );

      case 'pie':
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
          cx, cy, midAngle, innerRadius, outerRadius, percent, index
        }: any) => {
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

        return (
          <PieChart {...commonProps}>
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
            {config.showLegend && <Legend {...legendProps} />}
            <Pie
              data={chartData}
              dataKey={config.series[0]?.dataKey || 'value'}
              nameKey={config.nameKey || 'name'}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={config.innerRadius || 0}
              outerRadius={config.outerRadius || 80}
              startAngle={config.startAngle || 0}
              endAngle={config.endAngle || 360}
              {...animationProps}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`} 
                />
              ))}
            </Pie>
          </PieChart>
        );

      case 'scatter':
        // Transform data for scatter plot - ensure numeric values
        const scatterData = useMemo(() => {
          if (!chartData.length || !config.series.length) return [];
          
          return chartData.map(item => ({
            ...item,
            x: Number(item[config.xAxis] || 0),
            y: Number(item[config.series[0]?.dataKey] || 0),
            z: config.series[1] ? Number(item[config.series[1]?.dataKey] || 5) : 5 // Size of dots
          }));
        }, [chartData, config.xAxis, config.series]);

        return (
          <ScatterChart {...commonProps} data={scatterData}>
            {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey="x" type="number" name={config.xAxisLabel || config.xAxis} {...xAxisProps} />
            <YAxis dataKey="y" type="number" name={config.yAxisLabel || config.series[0]?.dataKey} {...yAxisProps} />
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} cursor={{ strokeDasharray: '3 3' }} />}
            {config.showLegend && <Legend {...legendProps} />}
            {config.series.map((seriesData, index) => (
              <Scatter
                key={seriesData.dataKey}
                name={seriesData.dataKey}
                data={scatterData}
                fill={seriesData.fill || config.colors[index % config.colors.length]}
                shape="circle"
                {...animationProps}
              />
            ))}
          </ScatterChart>
        );

      case 'radar':
        // Ensure radar chart has proper data structure
        const radarData = useMemo(() => {
          if (!chartData.length || !config.series.length) return [];
          
          return chartData.map(item => {
            const result = { [config.xAxis]: item[config.xAxis] };
            config.series.forEach(series => {
              result[series.dataKey] = Number(item[series.dataKey] || 0);
            });
            return result;
          });
        }, [chartData, config.xAxis, config.series]);

        return (
          <RadarChart {...commonProps} data={radarData}>
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
                fillOpacity={seriesData.fillOpacity || 0.3}
                strokeWidth={2}
                {...animationProps}
              />
            ))}
          </RadarChart>
        );

      case 'radialBar':
        // Transform data for radial bar - needs to be in percentage format
        const radialBarData = useMemo(() => {
          if (!chartData.length || !config.series.length) return [];
          
          const valueKey = config.series[0]?.dataKey;
          const maxValue = Math.max(...chartData.map(item => Number(item[valueKey] || 0)));
          
          return chartData.map((item, index) => ({
            ...item,
            value: Number(item[valueKey] || 0),
            // Convert to percentage for radial bar (0-100)
            percentage: maxValue > 0 ? Math.round((Number(item[valueKey] || 0) / maxValue) * 100) : 0,
            fill: config.colors?.[index % config.colors.length] || config.series[0]?.fill || '#8884d8'
          }));
        }, [chartData, config.series, config.colors]);

        return (
          <RadialBarChart {...commonProps} data={radialBarData} innerRadius="10%" outerRadius="80%">
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
            {config.showLegend && <Legend {...legendProps} />}
            <RadialBar
              dataKey="percentage"
              cornerRadius={10}
              startAngle={90}
              endAngle={450}
              {...animationProps}
            >
              {radialBarData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        );

      case 'funnel':
        // Transform data for funnel chart - calculate conversion rates
        const funnelData = useMemo(() => {
          if (!chartData.length || !config.series.length) return [];
          
          const valueKey = config.series[0]?.dataKey;
          const totalValue = chartData.reduce((sum, item) => sum + Number(item[valueKey] || 0), 0);
          
          return chartData.map((item, index) => ({
            ...item,
            value: Number(item[valueKey] || 0),
            // Calculate percentage of total for funnel visualization
            percentage: totalValue > 0 ? Math.round((Number(item[valueKey] || 0) / totalValue) * 100) : 0,
            name: item[config.xAxis] || `Stage ${index + 1}`,
            fill: config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`
          })).sort((a, b) => b.value - a.value); // Sort descending for funnel effect
        }, [chartData, config.series, config.colors, config.xAxis]);

        return (
          <FunnelChart {...commonProps} data={funnelData}>
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
            {config.showLegend && <Legend {...legendProps} />}
            <Funnel
              dataKey="value"
              nameKey="name"
              isAnimationActive={config.enableAnimation !== false}
              animationDuration={config.animationDuration || 1000}
            >
              {funnelData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
            </Funnel>
          </FunnelChart>
        );

      case 'treemap':
        // Transform data for treemap - needs hierarchical structure
        const treemapData = useMemo(() => {
          if (!chartData.length || !config.series.length) return [];
          
          const valueKey = config.series[0]?.dataKey;
          
          return chartData.map((item, index) => ({
            name: item[config.xAxis] || `Item ${index + 1}`,
            size: Number(item[valueKey] || 0),
            value: Number(item[valueKey] || 0), // Recharts treemap uses 'value' by default
            fill: config.colors?.[index % config.colors.length] || `hsl(${index * 45}, 70%, 60%)`
          })).filter(item => item.size > 0); // Remove zero/negative values
        }, [chartData, config.series, config.colors, config.xAxis]);

        return (
          <Treemap
            {...commonProps}
            data={treemapData}
            dataKey="value"
            aspectRatio={config.aspectRatio || 4/3}
            stroke="#fff"
            strokeWidth={2}
            content={<CustomTreemapContent colors={config.colors} />}
            {...animationProps}
          />
        );

      case 'waterfall':
        return (
          <BarChart {...commonProps} data={waterfallData}>
            {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {config.showTooltip !== false && <Tooltip content={(props) => <WaterfallTooltip {...props} config={config} />} />}
            {config.showLegend && <Legend {...legendProps} />}
            
            {/* Invisible base bars to position the visible bars correctly */}
            <Bar 
              dataKey="base" 
              stackId="waterfall" 
              fill="transparent" 
              {...animationProps} 
            />
            
            {/* Visible bars with conditional colors */}
            <Bar 
              dataKey="value" 
              stackId="waterfall" 
              radius={[4, 4, 0, 0]}
              {...animationProps}
            >
              {waterfallData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPositive ? '#22c55e' : '#ef4444'} 
                />
              ))}
            </Bar>
            
            {/* Optional: Add a reference line at zero */}
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
          </BarChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {config.showTooltip !== false && <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />}
            {config.showLegend && <Legend {...legendProps} />}
              {config.series ? (
                  config.series.map((seriesData) => {
                    if (seriesData.chartType === 'line') {
                      return (
                        <Line 
                          type="monotone" 
                          key={seriesData.dataKey} 
                          {...seriesData} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          {...animationProps}
                        />
                      );
                    } else if (seriesData.chartType === 'bar') {
                      return (
                        <Bar 
                          key={seriesData.dataKey} 
                          {...seriesData} 
                          radius={[4, 4, 0, 0]}
                          {...animationProps}
                        />
                      );
                    } else if (seriesData.chartType === 'area') {
                      return (
                        <Area 
                          type="monotone" 
                          key={seriesData.dataKey} 
                          {...seriesData} 
                          fillOpacity={seriesData.fillOpacity || 0.6}
                          {...animationProps}
                        />
                      );
                    }
                    return (
                      <Line 
                        key={seriesData.dataKey} 
                        {...seriesData} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        {...animationProps}
                      />
                    );
                  })
              ) : (
                config.type === 'line'
                  ? <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={2} dot={{ fill: config.colors[0] }} {...animationProps} />
                  : config.type === 'bar'
                    ? <Bar dataKey={config.yAxis} barSize={20} fill={config.colors[0]} {...animationProps} />
                    : config.type === 'area'
                      ? <Area type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} fill={config.colors[0]} fillOpacity={0.6} {...animationProps} />
                      : <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={2} dot={{ fill: config.colors[0] }} {...animationProps} />
              )}
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

  // Determine if we should use dark theme
  const isDarkTheme = config.theme === 'dark' ||
                     (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Determine background color
  let bgColorClass = isDarkTheme ? 'bg-[#1E2939FF]' : 'bg-[#ffffff]';
  let bgColorStyle = {};

  if (config.backgroundColor === 'transparent') {
    bgColorClass = 'bg-transparent';
  } else if (config.backgroundColor && config.backgroundColor !== 'default') {
    bgColorClass = '';
    bgColorStyle = { backgroundColor: config.backgroundColor };
  }

  return (
    <div
      className={`rounded-lg py-8 px-4 ${bgColorClass}`}
      id="chart-container"
      style={bgColorStyle}
    >
      {/* Title */}
      {config.title && (
        <div className={`px-10 mb-4 ${getTitleAlignment()}`}>
          <h2
            className={`text-2xl mb-0.5 ${
              config.titleWeight === 'bold' ? 'font-bold' : 
              config.titleWeight === 'light' ? 'font-light' :
              config.titleWeight === 'semibold' ? 'font-semibold' :
              'font-normal'
            }`}
            style={{ color: config.titleColor }}
          >
            {config.title}
          </h2>
          {/* Subtitle */}
          {config.subtitle && (
            <p
              className="text-lg opacity-80 "
              style={{ color: config.subtitleColor }}
            >
              {config.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={config.height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
