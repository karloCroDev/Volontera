// Components
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { Carousel } from '@/components/ui/carousel';
import { Heading } from '@/components/ui/heading';
import { getSession } from '@/lib/server/auth';

// Modules
import { PaymentPlanCard } from '@/modules/main/select-plan/payment-plan-card';
import { redirect } from 'next/navigation';

export default async function SelectPlan() {
	const user = await getSession();
	// TODO: Look if I need to write once again if I am running this code in layout or not
	if (!user.success) redirect('/auth/login');
	return (
		<>
			<Heading subtitle="Choose the additional features that you can use with [app]">
				Select plan
			</Heading>

			<div className="hidden gap-5 xl:flex">
				<PaymentPlanCard
					title="Beginner's Kit"
					price="4.99"
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
							variant="outline"
							href={
								process.env.NODE_ENV === 'development'
									? 'https://buy.stripe.com/test_00w28sekBgl87lF8Ah9ws05'
									: ''
							}
						>
							Current plan
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
								process.env.NODE_ENV === 'development'
									? 'https://buy.stripe.com/test_00w28sekBgl87lF8Ah9ws05'
									: ''
							}
						>
							Select plan
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
								process.env.NODE_ENV === 'development'
									? 'https://buy.stripe.com/test_8x2fZi1xPfh48pJeYF9ws04'
									: ''
							}
						>
							Select plan
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
									process.env.NODE_ENV === 'development'
										? 'https://buy.stripe.com/test_8x2fZi1xPfh48pJeYF9ws04'
										: ''
								}
							>
								Current plan
							</AnchorAsButton>
						}
					/>
				))}
			/>

			<p className="text-muted-foreground lg:text-md mt-7 text-center lg:mt-10">
				Your plan will be automatically renewed at the month&apos;s end
			</p>
		</>
	);
}

// // Don't need to hide in .env as this is a public link including the procing ID

// export const plans = [
// 	{
// 		// TODO: When I am going to deploy change the link to a production one!
// 		link:
// 			process.env.NODE_ENV === 'development'
// 				? 'https://buy.stripe.com/test_00w28sekBgl87lF8Ah9ws05'
// 				: '',
// 		priceId: 'price_1ScvyFKRaMWWrCqzuBTTFbTI',
// 		price: 4.99,
// 		type: 'monthly',
// 	},
// 	{
// 		// TODO: When I am going to deploy change the link to a production one!
// 		link:
// 			process.env.NODE_ENV === 'development'
// 				? 'https://buy.stripe.com/test_8x2fZi1xPfh48pJeYF9ws04'
// 				: '',
// 		priceId: 'price_1ScvxLKRaMWWrCqz6lKILtoL',
// 		price: 49.99,
// 		type: 'yearly',
// 	},
// ];
