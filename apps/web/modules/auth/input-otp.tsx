'use client';

// External packages
import * as React from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import { twJoin } from 'tailwind-merge';

export const InputOTP = () => {
  return (
    <OTPInput
      maxLength={6}
      containerClassName="group flex items-center has-[:disabled]:opacity-30"
      render={({ slots }) => (
        <div className="flex gap-8">
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  );
};

const Slot = ({ isActive, char }: SlotProps) => (
  <div
    className={twJoin(
      'relative h-14 w-10 text-2xl font-medium',
      'flex items-center justify-center',
      'transition-all',
      'border',
      'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 outline',
      isActive
        ? 'outline-accent-foreground outline-4'
        : 'outline-accent-foreground/20 outline-0'
    )}
  >
    {char && <p>{char}</p>}
  </div>
);
