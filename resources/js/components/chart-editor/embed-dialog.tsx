import InputError from '@/components/input-error';
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
import { Code, Copy, Eye, Link, Search, Settings, Share2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chartControls';
import ReactMarkdown from "react-markdown";
import { Markdown } from '@/components/markdown';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EmbedDialog({ config, data, columns }) {
    const [open, setOpen] = useState(false);

    const handleConfigChange = () => {
        // Handle configuration changes here
        toast.success('Configuration updated successfully!');
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="border">
                    <Share2 />
                    <span>Share</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Chart</DialogTitle>
                    <DialogDescription>Share your chart with others or embed it in your website.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList>
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
                                <Input id="share-link" placeholder="Generating link..." />
                            </div>
                            <Button
                                className="absolute top-3/4 right-2 h-4 w-4 -translate-y-3/4 transform"
                                variant="ghost"
                                onClick={() => {
                                    navigator.clipboard.writeText('https://your-share-link.com');
                                    toast.success('Link copied to clipboard!');
                                }}
                                aria-label="Copy link"
                            >
                                <Copy />
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="embed_code">
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Button variant="outline">
                                    <Copy />
                                    Copy Code
                                </Button>
                                <Card>
                                    <CardContent>
                                        <pre className="text-sm text-green-400">
                                            <code>
                                                {`<!-- DataColumn.ai Chart -->
<div id="dc-chart-123" style="width: ${config.responsive ? '100%' : config.width}; height: ${config.height}; border-radius: 8px; overflow: hidden;"></div>
<script>
(function() {
const container = document.getElementById('dc-chart-123');
const iframe = document.createElement('iframe');
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.border = 'none';
iframe.style.borderRadius = '8px';
iframe.src = '${window.location.origin}/embed/123?theme=${config.theme || 'light'}&watermark=${config.showWatermark}';
container.appendChild(iframe);
})();
</script>`}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <Button variant="outline">
                                    <Copy />
                                    Copy Code
                                </Button>
                                <Card>
                                    <CardContent>
                                        <pre className="text-sm text-green-400">
                                            <code>
                                                {`<!-- DataColumn.ai Chart -->
<iframe src="https://your-embed-url.com/chart/123?theme=light&watermark=true"></iframe> `}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">
                        <ChartControls config={config} columns={columns} onConfigChange={handleConfigChange} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
