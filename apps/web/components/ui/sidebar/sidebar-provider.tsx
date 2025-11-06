'use client';

// External packages
import * as React from 'react';

export const SidebarContext = React.createContext<{
	desktopOpen: boolean;
	setDesktopOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mobileOpen: boolean;
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useSidebarContext = () => {
	const ctx = React.useContext(SidebarContext);

	if (!ctx) throw new Error('Must be within the boundaries of sidebar context');

	return ctx;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [desktopOpen, setDesktopOpen] = React.useState(true);
	const [mobileOpen, setMobileOpen] = React.useState(false);

	return (
		<SidebarContext.Provider
			value={{ desktopOpen, setDesktopOpen, mobileOpen, setMobileOpen }}
		>
			{children}
		</SidebarContext.Provider>
	);
};
