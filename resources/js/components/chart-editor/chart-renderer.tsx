import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
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
                {config.series?.length ? config.series.map((data) => <Bar key={data.dataKey} {...data} />) : (<Bar dataKey={config.yAxis} />)}
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
                {config.series?.length ? (
                    config.series.map((data) => <Line key={data.dataKey} {...data} />)
                ) : (
                    <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={2} dot={{ fill: config.colors[0] }} />
                )}
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
              {config.series?.length ? (
                  config.series.map((data) => (
                      <Area key={data.dataKey} {...data} />
                  ))) : (
                  <Area
                      type="monotone"
                      dataKey={config.yAxis}
                      stroke={config.colors[0]}
                      fill={config.colors[0]}
                      fillOpacity={0.6}
                  />
              )}
          </AreaChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid {...config.grid} />}
            <XAxis dataKey={config.xAxis} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={(props) => <CustomTooltip {...props} config={config} />} />
            {config.showLegend && <Legend />}
              {config.series ? (
                  config.series.map((data) => {
                    if (data.chartType === 'line') {
                      return <Line type="monotone" key={data.dataKey} {...data} />;
                    } else if (data.chartType === 'bar') {
                      return <Bar type="monotone" key={data.dataKey} {...data} />;
                    } else if (data.chartType === 'area') {
                      return <Area type="monotone" key={data.dataKey} {...data} />;
                    }
                    <Line key={data.dataKey} {...data} />;
                  })
              ) : (
                config.type === 'line'
                  ? <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={2} dot={{ fill: config.colors[0] }} />
                  : config.type === 'bar'
                    ? <Bar dataKey={config.yAxis} barSize={20} fill={config.colors[0]} />
                    : config.type === 'area'
                      ? <Area type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} fill={config.colors[0]} fillOpacity={0.6} />
                      : <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={2} dot={{ fill: config.colors[0] }} />
              )}
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
            className={`text-2xl mb-0.5 ${config.titleWeight === 'bold' ? 'font-bold' : 'font-normal'}`}
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
