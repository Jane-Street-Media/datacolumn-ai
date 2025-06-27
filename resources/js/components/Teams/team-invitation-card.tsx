import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamInvitationCard({ invitation }) {

    const { delete: destroy, processing, } = useForm({
    });
    const handleCancelInvitation = () => {
        destroy(route('team-invitations.destroy', invitation.id), {
            only: ['teamInvitations', 'flash'],
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                toast(response.props.flash.success, {
                    description: '📭 The invitation has been pulled back.',
                });
            },
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-between flex-col lg:flex-row rounded-xl border p-4 space-y-4 lg:space-y-0"
            >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                            <AvatarFallback>{invitation.email}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">{invitation.email}</h3>
                        <p className="text-secondary-foreground text-sm">
                            Invited as <span className="font-semibold text-primary">{invitation.role}</span>
                        </p>
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row w-full lg:w-auto items-center space-x-4 space-y-4 lg:space-y-0">
                    <div className="text-right w-full lg:w-auto" >
                        <Badge className={'bg-yellow-500'}>{'pending'}</Badge>
                    </div>

                    <div className="text-muted-foreground text-right text-sm w-full lg:w-auto">
                        <p>Sent at: {format(new Date(invitation.created_at), 'MMM d, yyyy')}</p>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost">
                                <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action is irreversible. The selected invitation will be deleted and user wont see any invite for this team.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelInvitation} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </motion.div>
        </>
    );
}
