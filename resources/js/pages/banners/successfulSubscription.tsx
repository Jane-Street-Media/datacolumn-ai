import {useEffect} from 'react';
import confetti from 'canvas-confetti';
import CommandWithCopyButton from "@/pages/Utils/copyClipboardCommand";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";

const Heading = ({title, description}) => {
    return (
        <div className="mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const SubscriptionWelcome = () => {
    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: 0.6}
        });
    }, []);

    return (
        <AppLayout>
            <Head title="Dashboard"/>
            <div className="flex justify-center p-6">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="w-full">
                        <Heading
                            title="Successfully Purchased 🎉"
                            description="Thanks for upgrading to a subscription plan."
                        />
                        <div className="py-5 space-y-5">
                            <p>You have successfully subscribed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default SubscriptionWelcome;
