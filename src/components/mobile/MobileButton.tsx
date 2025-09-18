import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { MobileHapticsService } from '@/services/mobileServices';
import { cn } from '@/lib/utils';

interface MobileButtonProps extends ButtonProps {
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  touchFeedback?: boolean;
}

const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ hapticFeedback = 'medium', touchFeedback = true, className, onClick, ...props }, ref) => {
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback on mobile
      if (hapticFeedback !== 'none') {
        await MobileHapticsService.impact(hapticFeedback);
      }
      
      // Call original onClick handler
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'touch-target transition-cosmic',
          touchFeedback && 'touch-feedback',
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

MobileButton.displayName = 'MobileButton';

export default MobileButton;