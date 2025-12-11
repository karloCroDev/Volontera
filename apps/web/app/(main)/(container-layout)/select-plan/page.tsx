// External packages
import { redirect } from 'next/navigation';

// Components
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Carousel } from '@/components/ui/carousel';
import { Heading } from '@/components/ui/heading';

// Lib
import { getSession } from '@/lib/server/auth';

// Modules
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';

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
		monthlyPriceId: 'price_1ScvyFKRaMWWrCqzuBTTFbTI',
		yearlyPriceId: 'price_1ScvxLKRaMWWrCqz6lKILtoL',
	},
};

export default async function SelectPlan() {
	const user = await getSession();
	// TODO: Look if I need to write once again if I am running this code in layout or not
	if (!user.success) redirect('/auth/login');

	const prefilledStripeLink = (link: string) =>
		link + `?prefilled_email=${user.email}`;

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading subtitle="Choose the additional features that you can use with [app]">
					Select plan
				</Heading>

				<AnchorAsButton
					colorScheme="yellow"
					variant="outline"
					href={prefilledStripeLink(stripeLinks.links.customerPortalLink)}
				>
					Billing
				</AnchorAsButton>
			</div>

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
						<AnchorAsButton
							className="mt-6 w-full"
							size="md"
							variant="primary"
							href={
								user.pricingId === stripeLinks.priceIds.monthlyPriceId
									? prefilledStripeLink(stripeLinks.links.customerPortalLink)
									: prefilledStripeLink(stripeLinks.links.monthlyLink)
							}
						>
							{user.pricingId === stripeLinks.priceIds.monthlyPriceId
								? 'Current plan'
								: 'Select plan'}
						</AnchorAsButton>
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
						<AnchorAsButton
							className="mt-6 w-full"
							size="md"
							colorScheme="orange"
							href={
								user.pricingId === stripeLinks.priceIds.yearlyPriceId
									? prefilledStripeLink(stripeLinks.links.customerPortalLink)
									: prefilledStripeLink(stripeLinks.links.yearlyLink)
							}
						>
							{user.pricingId === stripeLinks.priceIds.yearlyPriceId
								? 'Current plan'
								: 'Select plan'}
						</AnchorAsButton>
					}
				/>
			</div>

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

			<p className="text-muted-foreground mt-7 text-center lg:mt-10">
				Your plan will be automatically renewed at the month&apos;s end
			</p>
		</>
	);
}
