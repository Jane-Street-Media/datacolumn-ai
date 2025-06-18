import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Stat } from '@/types';

interface StatsCardProps {
    stat: Stat;
    index: number;
    displayChange: boolean;
}

const MotionCard = motion(Card)

export default function StatsCard({ stat, index, displayChange = true }: StatsCardProps) {
    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary-foreground">{stat.name}</p>
                        <p className="mt-2 text-3xl font-bold text-foreground">{stat.value} { displayChange }</p>
                        { displayChange && (
                            <div className="mt-2 flex items-center">
                            <span
                                className={`text-sm font-medium ${
                                    stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                {stat.change}%
                            </span>
                                <span className="ml-1 text-sm text-secondary-foreground">from last month</span>
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </CardContent>
        </MotionCard>
    );
}
