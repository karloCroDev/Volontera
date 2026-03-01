// External packages
import {
	Bell,
	ClipboardList,
	CreditCard,
	ChevronDown,
	Sparkles,
	UserCog,
	UsersRound,
} from 'lucide-react';
import Image from 'next/image';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Logo } from '@/components/icons';
import { Accordion } from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';

// Modules
import { PricingPlans } from '@/modules/main/select-plan/pricing-plans';
import { CTA } from '@/modules/landing-page/cta';
import { Header } from '@/modules/landing-page/header';

// Lib
import { getSession } from '@/lib/server/user';
import { getBillingLink } from '@/lib/server/payment';
import { Footer } from '@/modules/landing-page/footer';

export default async function LandingPage() {
	const user = await getSession();
	const billingLink = user.success
		? await getBillingLink()
		: ({ success: false as const, message: '' } as const);

	return (
		<>
			<Header user={user} />
			<Layout className="scroll-smooth">
				<LayoutColumn>
					{/* Hero Section */}
					<section id="hero" className="mb-20 mt-40 px-6">
						<div className="mx-auto max-w-3xl text-center">
							<div className="flex items-center justify-center gap-4">
								<Logo className="size-48" />
								<h1 className="text-start text-5xl font-bold italic md:text-6xl">
									Your all-in-one volunteering platform
								</h1>
							</div>
							<p className="text-muted-foreground text-md mb-8">
								Volontera is a powerful platform designed to help you achieve
								your volunteering goals easier and smarter inside one
								centralized place
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<LinkAsButton href="/auth/register" size="lg" isFullyRounded>
									Get Started
								</LinkAsButton>
								<LinkAsButton
									href="/#features"
									variant="outline"
									size="lg"
									isFullyRounded
								>
									Learn More
								</LinkAsButton>
							</div>
						</div>

						{/* Add image */}
						<div className="border-input-border relative mx-auto mt-12 aspect-video w-full max-w-6xl overflow-hidden rounded-lg border">
							<Image
								src="/images/volontera-home.jpeg"
								alt="Volontera Home Page"
								fill
							/>
						</div>
					</section>

					{/* Features Section */}
					<section id="features" className="px-6 py-20">
						<div className="mx-auto">
							<h2 className="mb-4 text-center text-4xl font-bold">
								Main features
							</h2>
							<p className="text-muted-foreground mx-auto mb-16 text-center">
								Everything you need to manage your volunteering efforts
								effectively and efficiently
							</p>

							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								{[
									{
										title:
											'Dedicated Experience for Volunteers & Organizations',
										description:
											'Two tailored interfaces — one for volunteers to discover and engage, and one for organizations to manage, lead, and grow.',
										icon: UsersRound,
									},
									{
										title: 'Centralized Member & Role Management',
										description:
											'Organize volunteers, assign roles, and control permissions from a single structured system.',
										icon: UserCog,
									},
									{
										title: 'Built-in Task & Project Management',
										description:
											'Create, assign, and monitor tasks without relying on external tools.',
										icon: ClipboardList,
									},
									{
										title: 'Real-Time Communication & Notifications',
										description:
											'Instant updates keep teams aligned and informed at every stage of a project.',
										icon: Bell,
									},
									{
										title: 'Smart Application & Onboarding System',
										description:
											'Simplify volunteer recruitment with structured applications, approvals, and onboarding flows.',
										icon: Sparkles,
									},
									{
										title: 'Secure Payments & Subscription Management',
										description:
											'Integrated billing system for organizations with seamless plan upgrades and subscription control.',
										icon: CreditCard,
									},
								].map((feature, index) => (
									<Container
										key={index}
										className="rounded-lg border p-8 transition hover:shadow-lg"
									>
										<div className="bg-background-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
											<feature.icon className="text-background h-6 w-6" />
										</div>
										<h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</Container>
								))}
							</div>
						</div>
					</section>

					{/* Pricing Section */}
					<section id="pricing" className="px-6 py-20">
						<div className="mx-auto">
							<h2 className="mb-4 text-center text-4xl font-bold" id="pricing">
								Subscription plans{' '}
								{user.success &&
									(user.role === 'ORGANIZATION'
										? 'for organizations'
										: 'for users')}
							</h2>
							<p className="text-muted-foreground mb-16 text-center">
								Unlock the full potential of Volontera with our flexible
								subscription plans designed to fit your needs
							</p>

							<PricingPlans user={user} billingLink={billingLink} />
						</div>
					</section>

					{/* FAQ Section */}
					<section id="FAQ" className="px-6 py-20">
						<div className="mx-auto max-w-3xl">
							<h2 className="mb-4 text-center text-4xl font-bold">
								Frequently Asked Questions
							</h2>
							<p className="text-muted-foreground mb-12 text-center">
								Find answers to common questions about Volontera
							</p>

							<Accordion
								type="single"
								items={[
									{
										value: 'item-1',
										trigger: (
											<div className="border-input-border group flex w-full items-center justify-between gap-4 border-b py-4 text-left">
												<p className="text-md group-data-[state=open]:text-muted-foreground font-semibold group-data-[state=open]:italic">
													What is Volontera?
												</p>
												<ChevronDown className="text-muted-foreground size-5 transition-transform group-data-[state=open]:rotate-180" />
											</div>
										),
										contentProps: {
											children: (
												<div className="py-4">
													Volontera is an all-in-one platform that helps
													volunteers and organizations manage volunteering,
													communication, onboarding, tasks, and subscriptions in
													one place
												</div>
											),
										},
									},
									{
										value: 'item-2',
										trigger: (
											<div className="border-input-border group flex w-full items-center justify-between gap-4 border-b py-4 text-left">
												<p className="text-md group-data-[state=open]:text-muted-foreground font-semibold group-data-[state=open]:italic">
													Is Volontera free to use?
												</p>
												<ChevronDown className="text-muted-foreground size-5 transition-transform group-data-[state=open]:rotate-180" />
											</div>
										),
										contentProps: {
											children: (
												<div className="py-4">
													Yes. The Beginner&apos;s Kit plan is free and includes
													core features. Paid plans unlock additional
													capabilities and subscription management features.",
												</div>
											),
										},
									},
									{
										value: 'item-3',
										trigger: (
											<div className="border-input-border group flex w-full items-center justify-between gap-4 border-b py-4 text-left">
												<p className="text-md group-data-[state=open]:text-muted-foreground font-semibold group-data-[state=open]:italic">
													Who can create an organization?
												</p>
												<ChevronDown className="text-muted-foreground size-5 transition-transform group-data-[state=open]:rotate-180" />
											</div>
										),
										contentProps: {
											children: (
												<div className="py-4">
													Organization accounts can create and manage
													organizations. Volunteer accounts can join
													organizations and participate in projects and
													communication.,
												</div>
											),
										},
									},
									{
										value: 'item-4',
										trigger: (
											<div className="border-input-border group flex w-full items-center justify-between gap-4 border-b py-4 text-left">
												<p className="text-md group-data-[state=open]:text-muted-foreground font-semibold group-data-[state=open]:italic">
													Can I change or cancel my subscription?
												</p>
												<ChevronDown className="text-muted-foreground size-5 transition-transform group-data-[state=open]:rotate-180" />
											</div>
										),
										contentProps: {
											children: (
												<div className="py-4">
													Yes. If you&apos;re subscribed, you can manage your
													subscription from the billing portal at any time.,
												</div>
											),
										},
									},
									{
										value: 'item-5',
										trigger: (
											<div className="border-input-border group flex w-full items-center justify-between gap-4 border-b py-4 text-left">
												<p className="text-md group-data-[state=open]:text-muted-foreground font-semibold group-data-[state=open]:italic">
													Does Volontera support communication inside
													organizations?
												</p>
												<ChevronDown className="text-muted-foreground size-5 transition-transform group-data-[state=open]:rotate-180" />
											</div>
										),
										contentProps: {
											children: (
												<div className="py-4">
													Yes. Volontera includes direct messages, group chats,
													and notifications so members can stay aligned in real
													time.
												</div>
											),
										},
									},
								]}
							/>
						</div>
					</section>

					{/* Footer */}
				</LayoutColumn>
			</Layout>
			<CTA />
			<Footer />
		</>
	);
}
