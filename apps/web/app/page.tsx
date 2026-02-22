// External packages
import { Github, Linkedin, Mail } from 'lucide-react';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Volontera } from '@/components/ui/volonotera';
import { Logo } from '@/components/icons';

export default function LandingPage() {
	return (
		<>
			{/* Header */}
			<header className="bg-background border-b-input-border h-22 fixed top-0 z-50 w-full border-b">
				<Layout className="mx-auto flex items-center justify-between py-4">
					<Volontera />

					<nav className="hidden items-center gap-8 md:flex">
						<LinkAsButton variant="blank" href="/#yess">
							Features
						</LinkAsButton>
						<LinkAsButton variant="blank" href="/#yess">
							Pricing
						</LinkAsButton>
						<LinkAsButton variant="blank" href="/#yess">
							FAQ
						</LinkAsButton>
						<LinkAsButton variant="blank" href="/#yess">
							Contact
						</LinkAsButton>
					</nav>

					<div className="flex gap-4">
						<LinkAsButton
							href="/auth/login"
							variant="outline"
							size="sm"
							colorScheme="yellow"
						>
							Sign In
						</LinkAsButton>
						<LinkAsButton href="/auth/register" isFullyRounded size="sm">
							Sign Up
						</LinkAsButton>
					</div>
				</Layout>
			</header>

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
								centralized place.
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
						<div className="mx-auto mt-16 flex h-96 max-w-4xl items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
							<span className="text-gray-500">Product Demo / Screenshot</span>
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
								effectively and efficiently.
							</p>

							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								{[
									{
										title:
											'Dedicated Experience for Volunteers & Organizations',
										description:
											'Two tailored interfaces — one for volunteers to discover and engage, and one for organizations to manage, lead, and grow.',
									},
									{
										title: 'Centralized Member & Role Management',
										description:
											'Organize volunteers, assign roles, and control permissions from a single structured system.',
									},
									{
										title: 'Built-in Task & Project Management',
										description:
											'Create, assign, and monitor tasks without relying on external tools.',
									},
									{
										title: 'Real-Time Communication & Notifications',
										description:
											'Instant updates keep teams aligned and informed at every stage of a project.',
									},
									{
										title: 'Smart Application & Onboarding System',
										description:
											'Simplify volunteer recruitment with structured applications, approvals, and onboarding flows.',
									},
									{
										title: 'Secure Payments & Subscription Management',
										description:
											'Integrated billing system for organizations with seamless plan upgrades and subscription control.',
									},
								].map((feature, index) => (
									<div
										key={index}
										className="rounded-lg border border-gray-200 p-8 transition hover:shadow-lg"
									>
										<div className="mb-4 h-12 w-12 rounded-lg bg-blue-100"></div>
										<h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* Pricing Section */}
					<section id="pricing" className="px-6 py-20">
						<div className="mx-auto">
							<h2 className="mb-4 text-center text-4xl font-bold">
								Subscription plans
							</h2>
							<p className="text-muted-foreground mx-auto mb-16 max-w-2xl text-center">
								Unlock the full potential of Volontera with our flexible
								subscription plans designed to fit your needs.
							</p>
						</div>
					</section>

					{/* FAQ Section */}
					<section id="faq" className="px-6 py-20">
						<div className="mx-auto max-w-3xl">
							<h2 className="mb-4 text-center text-4xl font-bold">
								Frequently Asked Questions
							</h2>
							<p className="text-muted-foreground mb-12 text-center">
								Find answers to common questions about our product.
							</p>

							<div className="space-y-4"></div>
						</div>
					</section>

					{/* Footer */}
				</LayoutColumn>
			</Layout>

			{/* CTA Section */}
			<section
				id="contact"
				className="border-y-input-border border-y px-6 py-20"
			>
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="mb-6 text-4xl font-bold">Ready to get started?</h2>
					<p className="text-accent-foreground mb-8 text-xl italic">
						Join thousands of users who are already using our platform to
						achieve their volunteering goals. Sign up today and start making a
						difference!
					</p>
					<LinkAsButton href="/auth/register" className="mx-auto" size="md">
						Let&apos; go
					</LinkAsButton>
				</div>
			</section>

			<footer className="bg-muted px-6 py-16">
				<Layout className="mx-auto flex flex-col">
					<div className="mb-12 grid gap-12 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center gap-2">
								<Volontera />
							</div>
							<p className="text-sm">Building tools that help you succeed.</p>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Product</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="transition hover:text-white">
										Features
									</a>
								</li>
								<li>
									<a href="#" className="transition hover:text-white">
										Pricing
									</a>
								</li>
								<li>
									<a href="#" className="transition hover:text-white">
										Security
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Company</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="transition hover:text-white">
										About
									</a>
								</li>
								<li>
									<a href="#" className="transition hover:text-white">
										Blog
									</a>
								</li>
								<li>
									<a href="#" className="transition hover:text-white">
										Social
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Connect</h4>
							<div className="flex gap-4">
								<a href="#" className="transition hover:text-white">
									<Mail size={20} />
								</a>
								<a href="#" className="transition hover:text-white">
									<Linkedin size={20} />
								</a>
								<a href="#" className="transition hover:text-white">
									<Github size={20} />
								</a>
							</div>
						</div>
					</div>

					<div className="border-t-input-border flex flex-col items-center justify-between border-t pt-8 text-sm md:flex-row">
						<p>&copy; 2026 Volontera Inc. All rights reserved.</p>
						<p>Learn more</p>
					</div>
				</Layout>
			</footer>
		</>
	);
}
