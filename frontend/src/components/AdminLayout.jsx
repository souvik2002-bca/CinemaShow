import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, CalendarDays, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const location = useLocation();

  const links = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/movies', icon: <Film size={20} />, label: 'Movies' },
    { path: '/admin/shows', icon: <CalendarDays size={20} />, label: 'Shows' },
    { path: '/admin/bookings', icon: <Ticket size={20} />, label: 'Bookings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <motion.div 
        className="glass" 
        style={{ width: '250px', borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', padding: '2rem 1rem' }}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
      >
        <h3 className="text-gradient" style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>Admin Portal</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '8px', textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {link.icon}
                <span style={{ fontWeight: 500 }}>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
