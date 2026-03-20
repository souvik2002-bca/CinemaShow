import { motion } from 'framer-motion';

const AdminDashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 style={{ marginBottom: '2rem' }}>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin</h3>
          <p>Manage your cinema's catalog, schedules, and bookings from the sidebar menu.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
