import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserPlus, Users } from 'lucide-react';
import InviteMemberDialog from '@/components/InviteMemberDialog';

export default function QuickActions({ folders }) {
    return (
            <Card className="bg-gradient-to-r from-gradient-from to-gradient-to">
            <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                        <ProjectDialog
                            folders={folders}
                            trigger={
                                <Button className="flex w-full items-center space-x-3 rounded-lg bg-white/20 p-3 text-white transition-colors duration-200 hover:bg-white/30">
                                    <Plus className="h-4 w-4" />
                                    <span>Create New Project</span>
                                </Button>
                            }
                        />{' '}

                    <InviteMemberDialog
                        role={'owner'}
                        trigger={
                            <Button className="flex w-full items-center space-x-3 rounded-lg bg-white/20 p-3 text-white transition-colors duration-200 hover:bg-white/30">
                                <Users className="h-4 w-4" />
                                <span>Invite Team Member</span>
                            </Button>
                        }
                    />{' '}
                </div>
            </CardContent>
        </Card>
    );
}
