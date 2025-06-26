import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns'
import { UserPlus, UserMinus, UserPen, Send, Trash, Check, FolderPlus, FolderMinus, Pencil} from 'lucide-react';

const Icons = {
    UserPlus,
    UserMinus,
    UserPen,
    Send,
    Trash,
    Check,
    FolderPlus,
    FolderMinus,
    Pencil
};
export default function ActivityFeed({ activityLogs }) {

    const getLogTimeAgo = (logTime) => {
        return formatDistanceToNow(logTime)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="h-96 overflow-y-scroll">
                <div className="space-y-4">
                    {activityLogs.map((log, index) => {
                        const Icon = Icons[log.icon_name]; // dynamically resolve from string

                        return (
                            <div className="flex items-start space-x-3" key={index}>
                                <div className={`flex rounded-full h-8 w-8 items-center justify-center ${log.icon_background_class}`}>
                                    {Icon ? <Icon className={log.icon_class} /> : null}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">{log.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{getLogTimeAgo(log.created_at)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
