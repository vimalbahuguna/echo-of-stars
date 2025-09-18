import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMobile';
import MobileNavigation from './MobileNavigation';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MobileLayout = ({ children, showNavigation = true }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <CosmicHeader />
        <main className="flex-1">
          {children}
        </main>
        <CosmicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <main className={cn("flex-1", showNavigation && "pb-20")}>
        {children}
      </main>
      {showNavigation && <MobileNavigation />}
    </div>
  );
};

export default MobileLayout;