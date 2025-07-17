import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartEditorProvider } from '@/contexts/chart-editor-context';

export default function ChartEmbed({ chart, watermark }){
    const config = chart.config;
// Determine if we should use dark theme
    const isDarkTheme = config.theme === 'dark' ||
        (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    // Determine background color
    let bgColorClass = isDarkTheme ? 'bg-gray-800' : 'bg-white';
    let bgColorStyle = {};

    if (config.backgroundColor === 'transparent') {
        bgColorClass = 'bg-transparent';
        // add transparent background style to body
        document.body.style.background = 'transparent';
    } else if (config.backgroundColor && config.backgroundColor !== 'default') {
        bgColorClass = '';
        bgColorStyle = { backgroundColor: config.backgroundColor };
    }

    const watermarkClass = isDarkTheme ? 'text-white' : 'text-foreground';

    return (
        <ChartEditorProvider chart={chart}>
            <div className={`min-h-screen p-4 ${bgColorClass}`} style={bgColorStyle}>
                {chart && (
                    <div className="h-full">
                        <ChartRenderer />

                        {watermark && (
                            <div className={`mt-2 text-right text-xs ${watermarkClass}`}>
                                Powered by <a href="https://datacolumn.ai" target="_blank" rel="noopener noreferrer" className="text-primary">DataColumn.ai</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ChartEditorProvider>
    );
};
