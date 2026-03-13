import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Volontera } from '@/components/ui/volonotera';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const Footer = () => {
	return (
		<footer className="bg-muted px-6 py-16" id="contact">
			<Layout>
				<LayoutColumn className="flex flex-col">
					<div className="mb-12 grid gap-12 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center gap-2">
								<Volontera />
							</div>
							<p className="text-sm">Your all in one place for volunteering</p>
						</div>

						<div>
							<h4 className="mb-4 font-semibold">Product</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										href="/help"
										className="hover:text-muted-foreground transition"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="/select-plan"
										className="hover:text-muted-foreground transition"
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href="/help"
										className="hover:text-muted-foreground transition"
									>
										Security
									</Link>
								</li>
							</ul>
						</div>

						{/* TODO: Add all blank links after I complete all other neccessary things */}
						<div>
							<h4 className="mb-4 font-semibold">Company</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										href="#"
										className="hover:text-muted-foreground transition"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="/home"
										className="hover:text-muted-foreground transition"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-muted-foreground transition"
									>
										Social
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold">Connect</h4>
							<div className="flex gap-4">
								<Link
									href="#"
									className="hover:text-muted-foreground size-5 transition"
								>
									<Mail />
								</Link>
								<Link
									href="#"
									className="hover:text-muted-foreground size-5 transition"
								>
									<Linkedin />
								</Link>
								<Link
									href="#"
									className="hover:text-muted-foreground size-5 transition"
								>
									<Github />
								</Link>
							</div>
						</div>
					</div>

					<div className="border-t-input-border flex flex-col items-center justify-between border-t pt-8 text-sm md:flex-row">
						<p>&copy; 2026 Volontera Inc. All rights reserved.</p>
						<p>Learn more</p>
					</div>
				</LayoutColumn>
			</Layout>
		</footer>
	);
};
