import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
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
import { useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type InviteForm = {
    email: string;
    role: string;
};
export default function InviteMemberDialog() {
    const [open, setOpen] = useState(false); // dialog state

    const { data, setData, post, processing, errors, reset } = useForm<InviteForm>({
        email: '',
        role: 'owner',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('team.member.store', 1), {
            onError: (err) => console.error(err),
            onSuccess: () => {
                reset('email');
                setOpen(false)
            },
            onFinish: () => {},
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite Member</span>
                    </Button>
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
                        <InputError message={errors.email}/>
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
