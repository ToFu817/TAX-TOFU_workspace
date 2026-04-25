import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { NAV_ITEMS } from '../../utils/constants';
import './MainLayout.css';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentNav?.label || '儀表板';

  return (
    <div className="main-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Header title={pageTitle} collapsed={collapsed} />
      <main
        className="main-layout__content"
        style={{
          marginLeft: collapsed ? 72 : 260,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
