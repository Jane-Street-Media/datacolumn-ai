import { ChartRenderer } from '@/components/chart-editor/chart-renderer';

export default function ChartEmbed({ config, data }){

    const showWatermark = true;

    const theme = 'dark';

    const chart = {
        data: data,
        config: {
            ...config,
            theme: theme as 'light' | 'dark' | 'system'
        }
    };

    console.log('chart');
    console.log(chart);

    return (
        <div className="min-h-screen bg-white p-4">
            {chart && (
                <div className="h-full">
                    <ChartRenderer
                        data={chart.data}
                        config={chart.config}
                    />

                    {showWatermark && (
                        <div className="mt-2 text-right text-xs text-foreground">
                            Powered by <a href="https://datacolumn.ai" target="_blank" rel="noopener noreferrer" className="text-primary">DataColumn.ai</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
