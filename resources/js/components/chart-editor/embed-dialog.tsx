import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, Copy, Eye, Link, Settings, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chartControls';
import { Card, CardContent } from '@/components/ui/card';

export default function EmbedDialog({ chart, config, data, columns, handleConfigChange }) {
    const embedScript = `<!-- DataColumn.ai Chart -->
<div id="dc-chart-123" style="width: ${config.responsive ? '100%' : config.width}; height: ${config.height}; border-radius: 8px; overflow: hidden;"></div>
<script>
(function() {
  const container = document.getElementById('dc-chart-123');
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.src = "${route('chart.embed', chart.uuid)}";
  container.appendChild(iframe);
})();
</script>`;

    const embedIframe = `<!-- DataColumn.ai Chart -->
<iframe src="${route('chart.embed', chart.uuid)}"></iframe>`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Code copied to clipboard!');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="border">
                    <Share2 />
                    <span className={'hidden lg:block'}>Share</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={'w-full sm:max-w-[768px]'}>
                <div className={'flex flex-col gap-5 w-full max-w-[768px] h-full max-h-[90dvh] overflow-y-auto'}>

                    <DialogHeader>
                        <DialogTitle>Share Chart</DialogTitle>
                        <DialogDescription>Share your chart with others or embed it in your website.</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="account" className="w-full gap-5">
                        <TabsList className={'w-full'}>
                            <TabsTrigger value="preview">
                                <Eye />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="share_link">
                                <Link />
                                Share Link
                            </TabsTrigger>
                            <TabsTrigger value="embed_code">
                                <Code />
                                Embed Code
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings />
                                Settings
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview">
                            <ChartRenderer data={data} config={config} />
                        </TabsContent>
                        <TabsContent value="share_link">
                            <div className="relative flex items-center">
                                <div className="w-full">
                                    <Label htmlFor="share-link" className="mb-4">
                                        Share this link with others to view your chart.
                                    </Label>
                                    <Input id="share-link" placeholder="Generating link..." value={route('chart.embed', chart.uuid)} />
                                </div>
                                <Button
                                    className="absolute top-3/4 right-2 h-4 w-4 -translate-y-3/4 transform"
                                    variant="ghost"
                                    onClick={() => {
                                        navigator.clipboard.writeText(route('chart.embed', chart.uuid));
                                        toast.success('Link copied to clipboard!');
                                    }}
                                    aria-label="Copy link"
                                >
                                    <Copy />
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="embed_code">
                            <div className="flex flex-col gap-7">
                                <div>
                                    <h3 className="text-lg font-medium">Script Embed</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Embed the chart using a script and container div.
                                    </p>
                                    <div className="space-y-3">
                                        <Button variant="outline" onClick={() => handleCopy(embedScript)}>
                                            <Copy />
                                            Copy Code
                                        </Button>
                                        <Card>
                                            <CardContent>
                                                <pre className="text-sm text-green-400 w-full overflow-auto">
                                                  <code className="w-full overflow-auto">{embedScript}</code>
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium">Iframe Embed</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Embed the chart directly using an iframe.
                                    </p>
                                    <div className="space-y-3">
                                        <Button variant="outline" onClick={() => handleCopy(embedIframe)}>
                                            <Copy />
                                            Copy Code
                                        </Button>
                                        <Card>
                                            <CardContent>
                                                <pre className="text-sm text-green-400 w-full overflow-auto">
                                                  <code className="w-full overflow-auto">{embedIframe}</code>
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="settings">
                            <ChartControls config={config} columns={columns} onConfigChange={handleConfigChange} cardContentClasses={'max-h-full'} />
                        </TabsContent>
                    </Tabs>

                </div>
            </DialogContent>
        </Dialog>
    );
}
