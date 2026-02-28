'use client';

// External packages
import * as React from 'react';

// Types
import type { UserResponse } from '@repo/types/user';
import type { ServerHandleResponse } from '@repo/types/general';
import type { GeneratePaymentLinkResponse } from '@repo/types/payment';

// Components
import { Carousel } from '@/components/ui/carousel';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Button } from '@/components/ui/button';

// Modules
import { Plans } from '@/modules/main/select-plan/plans';
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';

type PricingAudience = UserResponse['role'];

const PublicPlans: React.FC<{ audience: PricingAudience }> = ({ audience }) => {
	const isOrg = audience === 'ORGANIZATION';

	const slides = [
		<PaymentPlanCard
			key={1}
			title="Beginner's Kit"
			price="0"
			duration="(All time)"
			reasons={
				isOrg ? (
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
				<LinkAsButton
					className="mt-auto w-full"
					size="md"
					variant="primary"
					href="/auth/register"
				>
					Sign up for free
				</LinkAsButton>
			}
		/>,
		<PaymentPlanCard
			key={2}
			title="Starter Pass"
			price="4.99"
			tag="Popular"
			duration="Monthly"
			reasons={
				isOrg ? (
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
				<LinkAsButton
					className="mt-auto w-full"
					size="md"
					href="/auth/login"
					variant="outline"
				>
					Sign in to select
				</LinkAsButton>
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
				isOrg ? (
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
				<LinkAsButton
					className="mt-auto w-full"
					size="md"
					colorScheme="yellow"
					href="/auth/login"
					variant="outline"
				>
					Sign in to select
				</LinkAsButton>
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
};

export const PricingPlans: React.FC<{
	user: UserResponse | ServerHandleResponse<false>;
	billingLink: GeneratePaymentLinkResponse | ServerHandleResponse<false>;
}> = ({ user, billingLink }) => {
	const [audience, setAudience] = React.useState<PricingAudience>('USER');

	if (user.success && billingLink.success)
		return <Plans user={user} billingLink={billingLink.url} />;

	return (
		<>
			<div className="border-input-border mx-auto mb-6 flex w-full max-w-6xl gap-4 rounded-lg border p-3 shadow-xl">
				<Button
					variant={audience === 'USER' ? 'primary' : 'ghost'}
					className="w-full"
					size="md"
					onPress={() => setAudience('USER')}
				>
					Users
				</Button>

				<Button
					variant={audience === 'ORGANIZATION' ? 'primary' : 'ghost'}
					className="w-full"
					size="md"
					onPress={() => setAudience('ORGANIZATION')}
				>
					Organization
				</Button>
			</div>

			<PublicPlans audience={audience} />
		</>
	);
};
