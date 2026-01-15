// External packages
import { twMerge } from 'tailwind-merge';

// Components
import * as Icons from '@/components/icons';

export type IconNames =
	| 'google'
	| 'login-represntation'
	| 'register-represntation'
	| 'password-represntation'
	| 'forgot-password-represntation'
	| 'logo';

const baseClasses = 'flex-shrink-0';

export const Icon: React.FC<
	React.ComponentPropsWithoutRef<'svg'> & {
		name: IconNames;
	}
> = ({
	/* eslint react/prop-types: 0 */
	name,
	className,
	...rest
}) => (
	<>
		{name === 'google' && (
			<Icons.GoogleIcon
				{...rest}
				className={twMerge('size-6', baseClasses, className)}
			/>
		)}
		{name === 'login-represntation' && (
			<Icons.LoginRepresentation
				{...rest}
				className={twMerge(baseClasses, className)}
			/>
		)}
		{name === 'password-represntation' && (
			<Icons.PasswordRepresentation
				{...rest}
				className={twMerge(baseClasses, className)}
			/>
		)}
		{name === 'register-represntation' && (
			<Icons.RegisterRepresentation
				{...rest}
				className={twMerge(baseClasses, className)}
			/>
		)}
		{name === 'forgot-password-represntation' && (
			<Icons.ForgotPasswordRepresentation
				{...rest}
				className={twMerge(baseClasses, className)}
			/>
		)}
		{name === 'logo' && (
			<Icons.Logo {...rest} className={twMerge(baseClasses, className)} />
		)}
	</>
);
