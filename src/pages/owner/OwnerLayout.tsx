import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { OwnerHeader } from '@/components/owner/OwnerHeader';

const OwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <OwnerSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? '64px' : '256px' }}
      >
        <OwnerHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
