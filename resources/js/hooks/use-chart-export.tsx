import { useCallback } from 'react';
import html2canvas from 'html2canvas-pro';
import Papa from 'papaparse';

export const useChartExport = () => {
  const exportChart = useCallback(async (filename: string = 'chart') => {
    const chartElement = document.getElementById('chart-container');
    if (!chartElement) {
      throw new Error('Chart not found');
    }

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to export chart');
    }
  }, []);

  const exportChartAsSVG = useCallback(async (filename: string = 'chart') => {
    const chartElement = document.getElementById('chart-container');
    if (!chartElement) {
      throw new Error('Chart not found');
    }

    try {
      // Find the SVG element within the chart container
      const svgElement = chartElement.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG chart found to export');
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Ensure the SVG has proper dimensions and namespace
      if (!clonedSvg.getAttribute('width')) {
        clonedSvg.setAttribute('width', svgElement.getBoundingClientRect().width.toString());
      }
      if (!clonedSvg.getAttribute('height')) {
        clonedSvg.setAttribute('height', svgElement.getBoundingClientRect().height.toString());
      }
      if (!clonedSvg.getAttribute('xmlns')) {
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      // Get the SVG markup
      const svgMarkup = new XMLSerializer().serializeToString(clonedSvg);

      // Create a complete SVG document with proper XML declaration
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgMarkup}`;

      // Create blob and download
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `${filename}.svg`;
      link.href = url;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG export error:', error);
      throw new Error('Failed to export chart as SVG');
    }
  }, []);

  const exportData = useCallback((data: any[], filename: string = 'data') => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  return { exportChart, exportChartAsSVG, exportData };
};
