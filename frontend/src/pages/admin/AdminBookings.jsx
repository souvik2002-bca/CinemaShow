import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`\${import.meta.env.REACT_APP_API_URL}/api/bookings`);
      setBookings(res.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 style={{ marginBottom: '2rem' }}>Global Bookings Ledger</h2>
      
      <div className="glass" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>USER</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>MOVIE</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SEATS</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AMOUNT</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr> : bookings.map(b => (
              <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>{b._id.slice(-6)}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{b.user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.user?.email}</div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{b.show?.movie?.title || 'Unknown Movie'}</td>
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{b.seats.join(', ')}</td>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-color)' }}>₹{b.totalAmount}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                    background: b.paymentStatus === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: b.paymentStatus === 'completed' ? '#4ade80' : '#fbbf24'
                  }}>
                    {b.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && bookings.length === 0 && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No Bookings Yet</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default AdminBookings;
