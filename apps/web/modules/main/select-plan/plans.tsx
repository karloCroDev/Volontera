'use client';

// External packages
import * as React from 'react';
import { SessionSuccessResponse } from '@repo/types/auth';

// Components
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Carousel } from '@/components/ui/carousel';

// Hooks
import { useCheckout } from '@/hooks/data/payments';

// Components
import { Button } from '@/components/ui/button';
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';

// Lib
import { toast } from '@/lib/utils/toast';
import { withReactQueryProvider } from '@/lib/utils/react-query';

const stripePriceIds = {
	yearlyPriceId: 'price_1S3ysJKRaMWWrCqznIxUk44x',
	monthlyPriceId: 'price_1S3yn2KRaMWWrCqzVwrGRwbI',
};

type PlansProps = {
	user: SessionSuccessResponse;
	billingLink: string;
};

export const Plans: React.FC<PlansProps> = withReactQueryProvider(
	({ user, billingLink }) => {
		const { mutate, isPending: isCheckoutPending } = useCheckout();

		const [pendingPriceId, setPendingPriceId] = React.useState<string | null>(
			null
		);
		const generateLink = ({ priceId }: { priceId: string }) => {
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

		const slides = [
			<PaymentPlanCard
				key={1}
				title="Beginner's Kit"
				price="0"
				duration="(All time)"
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
						className="mt-auto w-full"
						size="md"
						variant={!user.pricingId ? 'outline' : 'primary'}
						href={billingLink}
					>
						{!user.pricingId ? 'Current plan' : 'Select plan'}
					</AnchorAsButton>
				}
			/>,

			<PaymentPlanCard
				key={2}
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
							user.pricingId === stripePriceIds.monthlyPriceId
								? 'outline'
								: 'primary'
						}
						onClick={() =>
							user.pricingId
								? (window.location.href = billingLink)
								: generateLink({
										priceId: stripePriceIds.monthlyPriceId,
									})
						}
						isLoading={
							isCheckoutPending &&
							pendingPriceId === stripePriceIds.monthlyPriceId
						}
					>
						{user.pricingId === stripePriceIds.monthlyPriceId
							? 'Current plan'
							: 'Select plan'}
					</Button>
				}
			/>,
			<PaymentPlanCard
				key={3}
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
							user.pricingId === stripePriceIds.yearlyPriceId
								? 'outline'
								: 'primary'
						}
						onClick={() =>
							user.pricingId
								? (window.location.href = billingLink)
								: generateLink({
										priceId: stripePriceIds.yearlyPriceId,
									})
						}
						isLoading={
							isCheckoutPending &&
							pendingPriceId === stripePriceIds.yearlyPriceId
						}
					>
						{user.pricingId === stripePriceIds.yearlyPriceId
							? 'Current plan'
							: 'Select plan'}
					</Button>
				}
			/>,
		];
		return (
			<>
				<div className="hidden gap-5 xl:flex">{slides}</div>
				<Carousel slides={slides} />
			</>
		);
	}
);
