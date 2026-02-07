'use client';

// External packages
import * as React from 'react';
import { UserResponse } from '@repo/types/user';

// Components
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Carousel } from '@/components/ui/carousel';

// Hooks
import { useCheckout } from '@/hooks/data/payments';

// Components
import { Button } from '@/components/ui/button';
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';
import { isOrganizationAccount } from '@repo/permissons/index';

const stripePriceIds = {
	yearlyPriceId: 'price_1SuG9uKRaMWWrCqzp0Uh0EuQ',
	monthlyPriceId: 'price_1SuG9QKRaMWWrCqzJnJC1PEp',
};

export const Plans: React.FC<{
	user: UserResponse;
	billingLink: string;
}> = withReactQueryProvider(({ user, billingLink }) => {
	const { mutate, isPending: isCheckoutPending } = useCheckout();

	const [pendingPriceId, setPendingPriceId] = React.useState<string | null>(
		null
	);
	const generateLink = ({ priceId }: { priceId: string }) => {
		setPendingPriceId(priceId);

		mutate(
			{
				priceId,
			},
			{
				onSuccess: ({ url }) => {
					window.location.href = url;
				},
				onError: ({ message, title }) => {
					toast({
						content: message,
						title,
						variant: 'error',
					});
					setPendingPriceId(null);
				},
			}
		);
	};

	const slides = [
		<PaymentPlanCard
			key={1}
			title="Beginner's Kit"
			price="0"
			duration="(All time)"
			variant="primary"
			reasons={
				isOrganizationAccount(user.role) ? (
					<>
						<li>Create organizations</li>
						<li>Basic organization management features</li>
						<li>Communication (dm&apos;s and group chats)</li>
						<li>Free help assistant accross the application</li>
					</>
				) : (
					<>
						<li>Join organizations</li>
						<li>Basic organization management features</li>
						<li>Communication (dm&apos;s and group chats)</li>
						<li>Free help assistant accross the application</li>
					</>
				)
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
				isOrganizationAccount(user.role) ? (
					<>
						<li>All in Beginner&apos;s Kit +</li>
						<li>Advanced analytics for organization managment</li>
						<li>Verified organizations and profile</li>
						<li>Better ranking organization posts in home feed</li>
					</>
				) : (
					<>
						<li>All in Beginner&apos;s Kit +</li>
						<li>Additional AI features inside the organization</li>
						<li>Verified profile</li>
						<li>Your written posts are better ranked in home feed</li>
					</>
				)
			}
			link={
				<Button
					className="mt-auto w-full"
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
				isOrganizationAccount(user.role) ? (
					<>
						<li>All in Beginner&apos;s Kit +</li>
						<li>Advanced analytics for organization managment</li>
						<li>Verified organizations and profile</li>
						<li>Better ranking organization posts in home feed</li>
					</>
				) : (
					<>
						<li>All in Beginner&apos;s Kit +</li>
						<li>Additional AI features inside the organization</li>
						<li>Verified profile</li>
						<li>Your written posts are better ranked in home feed</li>
					</>
				)
			}
			link={
				<Button
					className="mt-auto w-full"
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
						isCheckoutPending && pendingPriceId === stripePriceIds.yearlyPriceId
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
			<div className="no-scrollbar hidden gap-5 overflow-x-scroll md:flex">
				{slides}
			</div>

			<div className="block md:hidden">
				<Carousel slides={slides} />
			</div>
		</>
	);
});
