import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns'

export default function ActivityFeed({ activityLogs }) {

    const getLogTimeAgo = (logTime) => {
        return formatDistanceToNow(logTime)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activityLogs.map((log, index) => (
                        <div className="flex items-start space-x-3" key={index}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <log.icon_name className={`${log.icon_class}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">{log.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{getLogTimeAgo(log.created_at)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
