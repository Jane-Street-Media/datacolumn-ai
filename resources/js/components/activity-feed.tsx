import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { Activity, Users, FileText, Plus, Layout } from 'lucide-react';

export default function ActivityFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">New chart created in Q3 Sales Analysis</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">Emily joined the Editorial Team</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">Market Research Dashboard published</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 w-full">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create New Project</span>
                        </button>
                        <button
                            className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                        >
                            <Users className="w-4 h-4" />
                            <span>Invite Team Member</span>
                        </button>
                        <button
                            className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3"
                        >
                            <Layout className="w-4 h-4" />
                            <span>Browse Templates</span>
                        </button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
