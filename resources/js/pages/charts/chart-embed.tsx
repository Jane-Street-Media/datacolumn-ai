import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartEditorProvider } from '@/contexts/chart-editor-context';

export default function ChartEmbed({ chart }){

    const showWatermark = true;

    const theme = 'dark';

    return (
        <ChartEditorProvider chart={chart}>
            <div className="min-h-screen bg-white p-4">
                {chart && (
                    <div className="h-full">
                        <ChartRenderer />

                        {showWatermark && (
                            <div className="mt-2 text-right text-xs text-foreground">
                                Powered by <a href="https://datacolumn.ai" target="_blank" rel="noopener noreferrer" className="text-primary">DataColumn.ai</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ChartEditorProvider>
    );
};
