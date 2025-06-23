import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

type InviteForm = {
    email: string;
    role: string;
};
type InviteMemberDialogProps = {
    role: string;
};
export default function InviteMemberDialog({ roles, trigger }: InviteMemberDialogProps) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false); // dialog state
    const { data, setData, post, processing, errors, reset } = useForm<InviteForm>({
        email: '',
        role: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('team.member.store', user.current_team_id), {
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                reset('email', 'role');
                setOpen(false);
                toast(response.props.flash.success, {
                    description: "🎉 We've rolled out the red carpet — your teammate's on their way!",
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite Member</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>Let’s get someone on board — drop their email below!</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="xyz.com"
                        />
                        <InputError message={errors.email} />

                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.name)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}{' '}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputError message={errors.role} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Invite
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
