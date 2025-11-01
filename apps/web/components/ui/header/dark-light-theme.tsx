'use client';

// External packages
import * as React from 'react';
import {
	ThemeProvider as NextThemesProvider,
	ThemeProviderProps,
	useTheme,
} from 'next-themes';
import { SunMoon } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

export const NextThemeProvider = ({ ...rest }: ThemeProviderProps) => {
	return <NextThemesProvider {...rest} />;
};

export const DarkLightThemeSwitch = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="outline"
			colorScheme="bland"
			className="hidden p-2 sm:block"
			onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			<SunMoon />
		</Button>
	);
};
