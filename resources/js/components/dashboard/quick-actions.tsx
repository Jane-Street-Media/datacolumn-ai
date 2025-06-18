import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuickActions() {
    return (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Project</span>
                    </Button>
                    <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                    >
                        <Users className="w-4 h-4" />
                        <span>Invite Team Member</span>
                    </Button>
                    <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                    >
                        <Layout className="w-4 h-4" />
                        <span>Browse Templates</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
