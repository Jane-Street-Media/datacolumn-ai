import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Stat } from '@/types';

interface StatsCardProps {
    stat: Stat;
    index: number;
}

const MotionCard = motion(Card)

export default function StatsCard({ stat, index }: StatsCardProps) {
    return (
        <MotionCard
            className="rounded-xl border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <div className="mt-2 flex items-center">
                            <span
                                className={`text-sm font-medium ${
                                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                {stat.change}
                            </span>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">from last month</span>
                        </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </CardContent>
        </MotionCard>
    );
}
