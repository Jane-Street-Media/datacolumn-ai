import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, Copy, Eye, Link, Settings, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chart-controls';
import { Card, CardContent } from '@/components/ui/card';
import { useChartEditor } from '@/contexts/chart-editor-context';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EmbedDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerClassName?: string;
}

export default function EmbedDialog({ 
    open, 
    onOpenChange,
    triggerClassName 
}: EmbedDialogProps) {
    const { chart, config, data } = useChartEditor();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('preview');
    
    // Use controlled state if provided, otherwise manage internally
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : dialogOpen;
    const setIsOpen = isControlled ? onOpenChange! : setDialogOpen;
    
    const iframeHeight = config.height || 400; // Default height for the iframe

    // Reset copied state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setCopiedItem(null);
            setActiveTab('preview');
        }
    }, [isOpen]);

    const embedScript = `<!-- DataColumn.ai Chart -->
<div id="dc-chart-${chart?.uuid || '123'}" style="width: 100%; height: ${iframeHeight}px; border-radius: 8px; overflow: hidden;"></div>
<script>
(function() {
  const container = document.getElementById('dc-chart-${chart?.uuid || '123'}');
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = "${iframeHeight}px";
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.src = "${chart ? route('chart.embed', chart.uuid) : ''}";
  container.appendChild(iframe);
})();
</script>`;

    const embedIframe = `<iframe 
  src="${chart ? route('chart.embed', chart.uuid) : ''}" 
  style="width: 100%; height: ${iframeHeight}px; border: none; border-radius: 8px;"
  title="${config.title || 'Chart'}"
></iframe>`;

    const shareLink = chart ? route('chart.embed', chart.uuid) : '';

    const handleCopy = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItem(itemId);
            toast.success('Copied to clipboard!');
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopiedItem(null);
            }, 2000);
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const dialogContent = (
        <DialogContent className="w-full sm:max-w-[768px] max-h-[90vh] p-0">
            <div className="flex flex-col h-full max-h-[90vh]">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
                    <DialogTitle className="text-lg sm:text-xl">Share Chart</DialogTitle>
                    <DialogDescription className="text-sm">
                        Share your chart with others or embed it in your website.
                    </DialogDescription>
                </DialogHeader>

                <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <TabsList className="mx-4 sm:mx-6 grid w-auto grid-cols-2 sm:grid-cols-4 gap-1">
                        <TabsTrigger value="preview" className="text-xs sm:text-sm">
                            <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Preview</span>
                            <span className="sm:hidden">View</span>
                        </TabsTrigger>
                        <TabsTrigger value="share_link" className="text-xs sm:text-sm">
                            <Link className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Share Link</span>
                            <span className="sm:hidden">Link</span>
                        </TabsTrigger>
                        <TabsTrigger value="embed_code" className="text-xs sm:text-sm">
                            <Code className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Embed Code</span>
                            <span className="sm:hidden">Embed</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs sm:text-sm">
                            <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                            <span>Settings</span>
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                        <TabsContent value="preview" className="mt-4">
                            <div className="border rounded-lg overflow-hidden">
                                <ChartRenderer data={data} config={config} />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="share_link" className="mt-4 space-y-4">
                            <div>
                                <Label htmlFor="share-link" className="text-sm sm:text-base mb-2 block">
                                    Share this link with others to view your chart.
                                </Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="share-link" 
                                        value={shareLink}
                                        readOnly
                                        className="font-mono text-xs sm:text-sm"
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleCopy(shareLink, 'share-link')}
                                        className="shrink-0"
                                    >
                                        {copiedItem === 'share-link' ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Mobile-friendly share buttons */}
                            <div className="sm:hidden space-y-2 pt-4">
                                <Label className="text-sm">Quick Share</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: config.title || 'Chart',
                                                    url: shareLink
                                                });
                                            } else {
                                                handleCopy(shareLink, 'share-link');
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(shareLink, '_blank')}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Open
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="embed_code" className="mt-4 space-y-6">
                            {/* Iframe Embed */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium">Iframe Embed</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Simple iframe embed code
                                        </p>
                                    </div>
                                    <Button 
                                        size="sm"
                                        variant="outline" 
                                        onClick={() => handleCopy(embedIframe, 'iframe')}
                                    >
                                        {copiedItem === 'iframe' ? (
                                            <Check className="h-4 w-4 mr-1 sm:mr-2 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 mr-1 sm:mr-2" />
                                        )}
                                        <span className="hidden sm:inline">Copy Code</span>
                                        <span className="sm:hidden">Copy</span>
                                    </Button>
                                </div>
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <pre className="text-xs sm:text-sm text-green-400 overflow-x-auto">
                                            <code>{embedIframe}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Script Embed */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium">Script Embed</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Advanced embed with script
                                        </p>
                                    </div>
                                    <Button 
                                        size="sm"
                                        variant="outline" 
                                        onClick={() => handleCopy(embedScript, 'script')}
                                    >
                                        {copiedItem === 'script' ? (
                                            <Check className="h-4 w-4 mr-1 sm:mr-2 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 mr-1 sm:mr-2" />
                                        )}
                                        <span className="hidden sm:inline">Copy Code</span>
                                        <span className="sm:hidden">Copy</span>
                                    </Button>
                                </div>
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <pre className="text-xs sm:text-sm text-green-400 overflow-x-auto">
                                            <code>{embedScript}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="settings" className="mt-4">
                            <ChartControls cardContentClasses="max-h-full p-0" />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DialogContent>
    );

    // If controlled mode without trigger
    if (isControlled && !triggerClassName) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {dialogContent}
            </Dialog>
        );
    }

    // Default mode with trigger button
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className={triggerClassName || "border"}>
                    <Share2 className="h-4 w-4" />
                    <span className="hidden lg:block ml-2">Share</span>
                </Button>
            </DialogTrigger>
            {dialogContent}
        </Dialog>
    );
}
