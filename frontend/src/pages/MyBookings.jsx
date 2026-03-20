import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/mybookings');
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>You haven't booked any tickets yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
          {bookings.map((booking, index) => (
            <motion.div 
              key={booking._id} 
              className="glass"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ display: 'flex', overflow: 'hidden', padding: 0 }}
            >
              <div style={{ flex: '0 0 120px' }}>
                <img 
                  src={booking.show.movie.posterUrl} 
                  alt={booking.show.movie.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{booking.show.movie.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle size={14} /> Confirmed
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} /> {new Date(booking.show.date).toLocaleDateString()} • {booking.show.time}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Seats</span>
                    <span style={{ fontWeight: 600 }}>{booking.seats.join(', ')}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Paid</span>
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
