import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { CheckCircle, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6 sm:space-y-8">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                        {/* Name Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full min-h-[44px] text-base sm:text-sm"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full min-h-[44px] text-base sm:text-sm"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />
                            <InputError className="mt-1" message={errors.email} />
                        </div>

                        {/* Email Verification Notice */}
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="font-medium underline decoration-amber-300 underline-offset-4 transition-colors duration-300 hover:decoration-amber-600 dark:decoration-amber-600 dark:hover:decoration-amber-400"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                            A new verification link has been sent to your email address.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Save Button and Status */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
                            <Button 
                                disabled={processing} 
                                className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0 transform translate-y-1"
                                enterTo="opacity-100 transform translate-y-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0 transform translate-y-1"
                            >
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <p className="text-sm font-medium">Changes saved successfully!</p>
                                </div>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* Delete User Section */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
