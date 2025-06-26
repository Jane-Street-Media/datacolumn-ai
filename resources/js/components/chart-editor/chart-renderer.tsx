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
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ChartConfig, DataPoint } from '../types';

interface ChartRendererProps {
  data: DataPoint[];
  config: ChartConfig;
}

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label, config }: TooltipProps<number, string> & { config: ChartConfig }) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = (value: number) => {
    switch (config.tooltipFormat) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
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

export const ChartRenderer: React.FC<ChartRendererProps> = ({ data, config }) => {
  // Memoize the processed data to avoid unnecessary recalculations
  const chartData = useMemo(() => {
    if (!data.length || !config.xAxis) {
      return [];
    }

      console.log('data');
      console.log(data);
      console.log(config);
      return data.map(item => ({
      ...item,
    }));
  }, [data, config.xAxis, config.yAxis]);

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
      return { top: 20, right: 30, left: 20, bottom: 20 };
    } else if (config.paddingOption === 'none') {
      return { top: 0, right: 0, left: 0, bottom: 0 };
    } else if (config.paddingOption === 'custom') {
      const padding = config.customPaddingValue || 0;
      return { top: padding, right: padding, left: padding, bottom: padding };
    }
    return { top: 20, right: 30, left: 20, bottom: 20 };
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
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
        offset: -10,
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

      console.log('config');
      console.log(config);
      switch (config.type) {
      case 'bar':
        return (
            <BarChart {...commonProps}>
                {config.showGrid && <CartesianGrid {...config.grid} />}
                <XAxis dataKey={config.xAxis} {...xAxisProps} />
                <YAxis {...yAxisProps} />
                <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
                {config.showLegend && <Legend />}
                {}
                {config.series.map((data) => (
                    <Bar key={data.dataKey} {...data} />
                ))}
            </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
              {config.series.map((data) => (
                  <Line key={data.dataKey} {...data} />
              ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
              {config.series.map((data) => (
                  <Area key={data.dataKey} {...data} />
              ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
              {config.series.map((data) => (
                  <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey={config.yAxis}
                      nameKey={config.xAxis}
                      label
                  >
                      {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
                      ))}
                  </Pie>
              ))}
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} type="number" {...xAxisProps} />
            <YAxis dataKey={config.yAxis} {...yAxisProps} />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
              {config.series.map((data) => (
                  <Scatter key={data.dataKey} {...data} />
              ))}
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius={150} {...commonProps}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey={config.xAxis} tick={{ fill: axisColor }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: axisColor }} />
            <Radar
              name={config.yAxis}
              dataKey={config.yAxis}
              stroke={config.colors[0]}
              fill={config.colors[0]}
              fillOpacity={0.6}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
          </RadarChart>
        );

      case 'radialBar':
        return (
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={140}
            barSize={10}
            {...commonProps}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey={config.yAxis}
              label={{ position: 'insideStart', fill: axisColor }}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </RadialBar>
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />}
          </RadialBarChart>
        );

      case 'funnel':
        return (
          <FunnelChart {...commonProps}>
            <Funnel
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              data={chartData}
              isAnimationActive
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Funnel>
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
          </FunnelChart>
        );

      case 'treemap':
        return (
          <Treemap
            data={chartData}
            dataKey={config.yAxis}
            nameKey={config.xAxis}
            aspectRatio={4/3}
            stroke="#fff"
            fill={config.colors[0]}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
            ))}
          </Treemap>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
            <Bar dataKey={config.yAxis} barSize={20} fill={config.colors[0]} />
            <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[1] || config.colors[0]} />
          </ComposedChart>
        );

      default:
        return null;
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
  let bgColorClass = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  let bgColorStyle = {};

  if (config.backgroundColor === 'transparent') {
    bgColorClass = 'bg-transparent';
  } else if (config.backgroundColor && config.backgroundColor !== 'default') {
    bgColorClass = '';
    bgColorStyle = { backgroundColor: config.backgroundColor };
  }

  return (
    <div
      className={`rounded-lg border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} ${bgColorClass}`}
      id="chart-container"
      style={bgColorStyle}
    >
      {/* Title */}
      {config.title && (
        <div className={`mb-4 ${getTitleAlignment()}`}>
          <h2
            className={`text-2xl mb-2 ${config.titleWeight === 'bold' ? 'font-bold' : 'font-normal'}`}
            style={{ color: config.titleColor }}
          >
            {config.title}
          </h2>
          {/* Subtitle */}
          {config.subtitle && (
            <p
              className="text-lg opacity-80"
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
