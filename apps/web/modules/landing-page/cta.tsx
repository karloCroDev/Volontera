// Components
import { LinkAsButton } from '@/components/ui/link-as-button';

export const CTA = () => (
	<section id="contact" className="border-y-input-border border-y px-6 py-20">
		<div className="mx-auto max-w-3xl text-center">
			<h2 className="mb-6 text-4xl font-bold">Ready to get started?</h2>
			<p className="text-accent-foreground mb-8 text-xl italic">
				&quot; Your all in one place where volunteers unite and make their ideas
				into actions! &quot;
			</p>
			<LinkAsButton href="/auth/register" className="mx-auto" size="md">
				Let&apos;s go
			</LinkAsButton>
		</div>
	</section>
);
