import {Button} from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import { Import, Save, Share2, Upload } from 'lucide-react';
export function ChartHeaderActions() {
    return (
        <Card>
            <CardContent>
                <PageHeader className="py-0">
                    <PageHeaderHead>
                        <PageHeaderTitle>Q1 Sales Analysis</PageHeaderTitle>
                        <PageHeaderDescription>Create and customize your data visualizations.</PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <Button>
                                    <Import />
                                    <span>Import</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Upload />
                                    <span>Export</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Save />
                                    <span>Save</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Share2 />
                                    <span>Share</span>
                                </Button>
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>
            </CardContent>
        </Card>
    );
}
