'use client';

// External packages
import * as React from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { twMerge } from 'tailwind-merge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SwiperNavButtons = () => {
	const swiper = useSwiper();

	return (
		<div className="absolute top-1/2 z-20 flex w-full -translate-y-1/2 justify-between px-2">
			<Button
				isFullyRounded
				className="bg-background p-4"
				colorScheme="bland"
				variant="outline"
				onPress={() => {
					swiper.slidePrev();
				}}
			>
				<ArrowLeft />
			</Button>
			<Button
				isFullyRounded
				className="p-4"
				colorScheme="bland"
				onPress={() => {
					swiper.slideNext();
				}}
			>
				<ArrowLeft className="rotate-180" />
			</Button>
		</div>
	);
};

export const Carousel: React.FC<{
	slides: React.ReactNode[];
	swiperProps?: React.ComponentProps<typeof Swiper>;
}> = ({ slides, swiperProps }) => {
	return (
		<div className="relative">
			<Swiper
				modules={[Pagination, Navigation]}
				pagination={{ type: 'bullets', clickable: true }}
				spaceBetween={24}
				slidesPerView={1}
				loop
				className={twMerge('size-full', swiperProps?.className)}
				{...swiperProps}
			>
				<SwiperNavButtons />
				{slides.map((slide, i) => (
					<SwiperSlide
						key={i}
						className={twMerge(
							'mySwiper relative flex h-fit justify-center',
							swiperProps?.className
						)}
					>
						{slide}
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
