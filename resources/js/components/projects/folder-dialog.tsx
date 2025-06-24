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
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FolderOpen, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

type FolderForm = {
    name: string;
    description: string;
};

export default function FolderDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<FolderForm>({
        name: '',
        description: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('folder.store'), {
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                console.log(response);
                reset('name','description');
                setOpen(false);
                toast(response.props.flash.success, {
                    description: '📁 New folder created! Start organizing your projects with ease.'
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FolderOpen />
                    <span>New Folder</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Organize your projects by creating a new folder with a custom
                        name.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                            id="name"
                            type="name"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter Folder Name"
                        />
                        <InputError message={errors.name} />
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            required
                            autoFocus
                            tabIndex={2}
                            autoComplete="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            placeholder="Enter Folder Description"
                        />
                        <InputError message={errors.description} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" tabIndex={3} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Folder
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
