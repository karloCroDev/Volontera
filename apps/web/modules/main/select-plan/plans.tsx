'use client';

// External packages
import * as React from 'react';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Carousel } from '@/components/ui/carousel';
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';
import { useSession } from '@/hooks/data/auth';
import { SessionSuccessResponse } from '@repo/types/auth';
import { useCheckout } from '@/hooks/data/payments';
import { toast } from '@/lib/utils/toast';
import { Button } from '@/components/ui/button';
import { withReactQueryProvider } from '@/lib/utils/react-query';

const stripeLinks = {
	links: {
		customerPortalLink:
			process.env.NODE_ENV === 'development'
				? 'https://billing.stripe.com/p/login/test_3cI7sMb8p0ma5dxbMt9ws00'
				: '',
		monthlyLink:
			process.env.NODE_ENV === 'development'
				? 'https://buy.stripe.com/test_8x2fZi1xPfh48pJeYF9ws04'
				: '',
		yearlyLink:
			process.env.NODE_ENV === 'development'
				? 'https://buy.stripe.com/test_00w28sekBgl87lF8Ah9ws05'
				: '',
	},

	// These price IDs don't need to be hidden as env variables since they don't have to be secret
	priceIds: {
		yearlyPriceId: 'price_1ScvyFKRaMWWrCqzuBTTFbTI',
		monthlyPriceId: 'price_1ScvxLKRaMWWrCqz6lKILtoL',
	},
};

export const Plans: React.FC<{
	user: SessionSuccessResponse;
}> = withReactQueryProvider(({ user }) => {
	const prefilledStripeLink = (link: string) =>
		link + `?prefilled_email=${user.email}`;

	const { mutate, isPending } = useCheckout();

	const [pendingPriceId, setPendingPriceId] = React.useState<string | null>(
		null
	);
	const generateLink = (priceId: string) => {
		console.log(priceId);

		setPendingPriceId(priceId);
		mutate(priceId, {
			onSuccess: ({ url, message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});
				window.location.href = url;
			},
		});
	};

	return (
		<div className="hidden gap-5 xl:flex">
			<PaymentPlanCard
				title="Beginner's Kit"
				price="0"
				duration="(All time)"
				variant="primary"
				reasons={
					<>
						<li>Hello world</li>
					</>
				}
				link={
					<AnchorAsButton
						className="mt-auto w-full"
						size="md"
						variant={!user.pricingId ? 'outline' : 'primary'}
						href={prefilledStripeLink(stripeLinks.links.customerPortalLink)}
					>
						{!user.pricingId ? 'Current plan' : 'Select plan'}
					</AnchorAsButton>
				}
			/>

			<PaymentPlanCard
				title="Starter Pass"
				price="4.99"
				tag="Popular"
				duration="Monthly"
				variant="primary"
				reasons={
					<>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
					</>
				}
				link={
					<Button
						className="mt-6 w-full"
						size="md"
						variant={
							user.pricingId === stripeLinks.priceIds.monthlyPriceId
								? 'outline'
								: 'primary'
						}
						onClick={() => generateLink(stripeLinks.priceIds.monthlyPriceId)}
						isLoading={
							isPending &&
							pendingPriceId === stripeLinks.priceIds.monthlyPriceId
						}
					>
						{user.pricingId === stripeLinks.priceIds.monthlyPriceId
							? 'Current plan'
							: 'Select plan'}
					</Button>
				}
			/>
			<PaymentPlanCard
				title="Elite Suite"
				price="49.99"
				tag="Best value"
				duration="Yearly"
				variant="secondary"
				reasons={
					<>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
						<li>Hello world</li>
					</>
				}
				link={
					<Button
						className="mt-6 w-full"
						size="md"
						colorScheme="yellow"
						variant={
							user.pricingId === stripeLinks.priceIds.yearlyPriceId
								? 'outline'
								: 'primary'
						}
						onClick={() => generateLink(stripeLinks.priceIds.yearlyPriceId)}
						isLoading={
							isPending && pendingPriceId === stripeLinks.priceIds.yearlyPriceId
						}
					>
						{user.pricingId === stripeLinks.priceIds.yearlyPriceId
							? 'Current plan'
							: 'Select plan'}
					</Button>
				}
			/>
		</div>
	);
});

export const PlansCarousel: React.FC<{
	user: SessionSuccessResponse;
}> = ({ user }) => {
	return (
		<Carousel
			slides={[...Array(3)].map((_, i) => (
				<PaymentPlanCard
					price="0"
					key={i}
					title="Free"
					duration="(All time)"
					variant={i % 2 == 0 ? 'primary' : 'secondary'}
					reasons={
						<>
							<li>Hello world</li>
							<li>Hello world</li>
							<li>Hello world</li>
							<li>Hello world</li>
							<li>Hello world</li>
							<li>Hello world</li>
						</>
					}
					link={
						<AnchorAsButton
							className="mt-6 w-full"
							size="md"
							variant="outline"
							colorScheme="orange"
							href={
								(process.env.NODE_ENV === 'development'
									? 'https://buy.stripe.com/test_8x2fZi1xPfh48pJeYF9ws04'
									: '') + `?prefilled_email=${user.email}`
							}
						>
							Current plan
						</AnchorAsButton>
					}
				/>
			))}
		/>
	);
};
