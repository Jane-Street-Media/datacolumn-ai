import GuestPricing from '@/pages/pricing/guest-pricing';
import HomeLayout from '@/layouts/home-layout';

export default function HomePricing({ plans }) {
    return (
        <HomeLayout>
            <GuestPricing plans={plans}/>
        </HomeLayout>
    );
};
