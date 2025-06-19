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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';
import { toast } from 'sonner';

type ProjectForm = {
    name: string;
    description: string;
    folder_id: number;
};

export default function ProjectDialog({ folders, project = null }) {
    const [open, setOpen] = useState(false); // dialog state
    const { data, setData, post, patch, processing, errors, reset } = useForm<ProjectForm>({
        name: project?.name ?? '',
        description: project?.description ?? '',
        folder_id: project?.folder_id ?? '',
    });

    const isEdit = useMemo(() => !!project?.id, [project]);
    const formRoute = useMemo(() => (isEdit ? route('project.update', project.id) : route('project.store')), [isEdit, project]);

    const descriptionText = useMemo(
        () =>
            isEdit
                ? 'Update your project details — change the name or description as needed.'
                : 'Start organizing your work — give your project a name and optional description.',
        [isEdit],
    );

    const action = isEdit ? patch : post;
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        action(formRoute, {
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                console.log(response);
                reset('name', 'description');
                setOpen(false);
                toast(response.props.flash.success, {
                    description: isEdit
                        ? '🛠️ Your changes are live and ready to shine.'
                        : '🚀 Time to bring your ideas to life!',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className="border">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{isEdit ? 'Update Project' : 'New Project'}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Update Project' : 'Create New Project'}</DialogTitle>
                    <DialogDescription>{descriptionText}</DialogDescription>
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
                            placeholder="Enter Project Name"
                        />
                        <InputError message={errors.name} />
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            placeholder="Enter Project Description"
                        />
                        <InputError message={errors.description} />

                        <Label htmlFor="folder">Folder</Label>
                        <Select value={String(data.folder_id)} onValueChange={(value) => setData('folder_id', Number(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a folder" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {folders.map((folder) => (
                                        <SelectItem key={folder.id} value={String(folder.id)}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.folder_id} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
