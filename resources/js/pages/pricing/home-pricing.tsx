import Pricing from '@/pages/pricing/pricing';
import HomeLayout from '@/layouts/home-layout';

export default function HomePricing({ plans }) {
    return (
        <HomeLayout>
            <Pricing plans={plans}/>
        </HomeLayout>
    );
};
