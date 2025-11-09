// Components
import { Heading } from '@/components/ui/heading';
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';

export default async function SelectPlan() {
	return (
		<>
			<Heading subtitle="Choose the additional features that you can use with [app]">
				Select plan
			</Heading>

			<div className="flex gap-5">
				{[...Array(3)].map((_, i) => (
					<PaymentPlanCard
						key={i}
						title="Free"
						duration="(All time)"
						variant={i % 2 == 0 ? 'primary' : 'secondary'}
						reasons={
							<>
								<li>Hello world</li>
							</>
						}
					/>
				))}
			</div>
			<p className="text-muted-foreground lg:text-md mt-7 text-center lg:mt-10">
				Your plan will be automatically renewed at the month&apos;s end
			</p>
		</>
	);
}
