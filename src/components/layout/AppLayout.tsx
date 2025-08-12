import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  className?: string;
}

const AppLayout = ({ children, showNavbar = true, className = "" }: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 ${className}`}>
      {showNavbar && <Navbar />}
      <div className={`container mx-auto px-6 max-w-7xl ${showNavbar ? 'py-12 mt-16' : 'py-12'}`}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;