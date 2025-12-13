// External packages
import { redirect } from 'next/navigation';

// Components
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Heading } from '@/components/ui/heading';

// Modules
import { Plans } from '@/modules/main/select-plan/plans';

// Lib
import { getSession } from '@/lib/server/auth';
import { getBillingLink } from '@/lib/server/payment';

export default async function SelectPlan() {
	const user = await getSession();

	if (!user.success) redirect('/auth/login');

	const billingLink = await getBillingLink();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading subtitle="Choose the additional features that you can use with [app]">
					Select plan
				</Heading>

				{billingLink.success && (
					<AnchorAsButton
						colorScheme="yellow"
						variant="outline"
						href={billingLink.url}
					>
						Billing
					</AnchorAsButton>
				)}
			</div>
			<Plans
				user={user}
				billingLink={billingLink.success ? billingLink.url : ''}
			/>
			<p className="text-muted-foreground mt-7 text-center lg:mt-10">
				Your plan will be automatically renewed at the month&apos;s end
			</p>
		</>
	);
}
