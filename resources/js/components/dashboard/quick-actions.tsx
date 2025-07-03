import InviteMemberDialog from '@/components/InviteMemberDialog';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Deferred, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { LoadingSkeleton } from '@/components/loading-skeleton';

export default function QuickActions({ folders, roles, projectStatuses }) {
    return (
        <Card className="from-gradient-from to-gradient-to bg-gradient-to-r">
            <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <ProjectDialog
                        folders={folders}
                        statuses={projectStatuses}
                        trigger={
                            <Button className="flex w-full items-center space-x-3 rounded-lg bg-white/20 p-3 text-white transition-colors duration-200 hover:bg-white/30">
                                <Plus className="h-4 w-4" />
                                <span>Create New Project</span>
                            </Button>
                        }
                    />{' '}
                    <Deferred data="roles">
                        <InviteMemberDialog
                            roles={roles}
                            trigger={
                                <Button className="flex w-full items-center space-x-3 rounded-lg bg-white/20 p-3 text-white transition-colors duration-200 hover:bg-white/30">
                                    <Users className="h-4 w-4" />
                                    <span>Invite Team Member</span>
                                </Button>
                            }
                        />{' '}
                    </Deferred>
                </div>
            </CardContent>
        </Card>
    );
}
