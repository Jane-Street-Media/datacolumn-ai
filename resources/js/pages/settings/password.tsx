import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, Eye, EyeOff, Shield, Lock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    
    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    // Password strength indicator (basic)
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(data.password);
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6 sm:space-y-8">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <HeadingSmall 
                            title="Update password" 
                            description="Ensure your account is using a long, random password to stay secure" 
                        />
                    </div>

                    <form onSubmit={updatePassword} className="space-y-4 sm:space-y-6">
                        {/* Current Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="current_password" className="text-sm font-medium">
                                Current password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    type={showCurrentPassword ? "text" : "password"}
                                    className="mt-1 block w-full min-h-[44px] text-base sm:text-sm pr-12"
                                    autoComplete="current-password"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.current_password} />
                        </div>

                        {/* New Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                New password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type={showNewPassword ? "text" : "password"}
                                    className="mt-1 block w-full min-h-[44px] text-base sm:text-sm pr-12"
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {data.password && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-300'}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[60px]">
                                            {strengthTexts[passwordStrength - 1] || 'Too Short'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Password should contain uppercase, lowercase, numbers, and special characters
                                    </div>
                                </div>
                            )}
                            
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                Confirm password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="mt-1 block w-full min-h-[44px] text-base sm:text-sm pr-12"
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {data.password_confirmation && (
                                <div className="mt-1">
                                    {data.password === data.password_confirmation ? (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs">Passwords match</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <Lock className="h-4 w-4" />
                                            <span className="text-xs">Passwords don't match</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Security Tips */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Password Security Tips</h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Use at least 8 characters (12+ recommended)</li>
                                <li>• Mix uppercase, lowercase, numbers, and symbols</li>
                                <li>• Avoid common words or personal information</li>
                                <li>• Consider using a password manager</li>
                            </ul>
                        </div>

                        {/* Save Button and Status */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
                            <Button 
                                disabled={processing || (data.password && data.password !== data.password_confirmation)} 
                                className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4 mr-2" />
                                        Update Password
                                    </>
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
                                    <p className="text-sm font-medium">Password updated successfully!</p>
                                </div>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
