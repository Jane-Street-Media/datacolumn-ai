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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamMember({ user, roles }) {
    const { data, setData, patch } = useForm({
        role: user.roles[0].name ?? '',
    });

    const handleSwitchRole = (value) => {
        setData((data.role = value));
        patch(route('team.member.update', user.id), {
            only: ['user', 'flash'],
            onSuccess: (response) => {
                toast.success(response.props.flash.success, {
                    description: 'Role assigned successfully! Your team member is ready to go.',
                });
            },
        });
    };

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing, } = useForm({
        user_id: '',
    });
    const handleDeleteUser = () => {
        setDeleteData((deleteData.user_id = user.id));
        destroy(route('team.member.destroy', user.current_team_id), {
            only: ['user', 'flash'],
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                toast(response.props.flash.success, {
                    description: '🚀 Your project has been deleted successfully.',
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
                className="flex items-center justify-between rounded-xl border p-4"
            >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar>
                        <div
                            className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                'active' === 'active' ? 'bg-green-500' : 'pending' === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}
                        />
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">{user.name}</h3>
                        <p className="text-secondary-foreground text-sm">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <Select value={data.role} onValueChange={handleSwitchRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {roles?.map((role) => (
                                        <SelectItem key={role.id} value={String(role.name)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Badge>{'active'}</Badge>
                    </div>

                    <div className="text-muted-foreground text-right text-sm">
                        <p>Joined {format(new Date(user.created_at), 'MMM d, yyyy')}</p>
                        <p className="text-xs">Last active {format(new Date(), 'MMM d, h:mm a')}</p>
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
                                    This action is irreversible. The selected user will be permanently deleted from the team.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteUser} disabled={processing}>
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
