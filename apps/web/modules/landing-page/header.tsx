// External packages
import { ArrowRight } from 'lucide-react';
import * as React from 'react';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Volontera } from '@/components/ui/volonotera';
import { Avatar } from '@/components/ui/avatar';

// Lib
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { UserResponse } from '@repo/types/user';
import { ServerHandleResponse } from '@repo/types/general';

export const Header: React.FC<{
	user: UserResponse | ServerHandleResponse<false>;
}> = ({ user }) => (
	<header className="bg-background border-b-input-border h-22 fixed top-0 z-50 w-full border-b">
		<Layout>
			<LayoutColumn className="flex items-center justify-between py-4">
				<Volontera />

				<nav className="hidden items-center gap-8 md:flex">
					<LinkAsButton variant="blank" href="/#features">
						Features
					</LinkAsButton>
					<LinkAsButton variant="blank" href="/#pricing">
						Pricing
					</LinkAsButton>
					<LinkAsButton variant="blank" href="/#FAQ">
						FAQ
					</LinkAsButton>
					<LinkAsButton variant="blank" href="/#contact">
						Contact
					</LinkAsButton>
				</nav>

				{user.success ? (
					<LinkAsButton
						href="/home"
						variant="ghost"
						size="sm"
						iconRight={<ArrowRight />}
						isFullyRounded
						iconLeft={
							<Avatar
								imageProps={{
									src: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${user.image}`,
								}}
								size="sm"
							>
								{convertToFullname({
									firstname: user.firstName,
									lastname: user.lastName,
								})}
							</Avatar>
						}
					>
						<div className="flex flex-col items-start">
							<p>
								{convertToFullname({
									firstname: user.firstName,
									lastname: user.lastName,
								})}
							</p>
							<p className="text-muted-foreground text-xs">
								{user.role === 'ORGANIZATION' ? 'Organization' : 'Volunteer'} |{' '}
								{convertToPascalCase(user.subscriptionTier)}
							</p>
						</div>
					</LinkAsButton>
				) : (
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
				)}
			</LayoutColumn>
		</Layout>
	</header>
);
