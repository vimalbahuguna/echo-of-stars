import React from 'react';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AstrologySection = () => {
  return (
    <div className="min-h-screen bg-background">
      <CosmicHeader />
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center">Astrology Section</h1>
          <p className="text-center text-muted-foreground">Content for the Astrology section will go here.</p>
        </div>
      </div>
      <CosmicFooter />
    </div>
  );
};

export default AstrologySection;
