import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SeatSelection = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Generate 6 rows, 10 seats each = 60 seats (A1...F10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        // Find show details to get price (Since we only implemented `GET /api/shows?movie=id`, 
        // we will fetch all shows and find this one, or ideally we should have a `GET /api/shows/:id` endpoint.
        // For simplicity, we get price from a mock or we pass it via state. Or we assume standard price.
        // Let's rely on backend strictly: creating order will return correct total.)
        
        const seatsRes = await axios.get(`http://localhost:5000/api/shows/${showId}/seats`);
        setBookedSeats(seatsRes.data.bookedSeats || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchShowData();
  }, [showId]);

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;
    setProcessing(true);

    try {
      // 1. Create Order
      const { data: orderData } = await axios.post('http://localhost:5000/api/bookings/create-order', {
        showId,
        seats: selectedSeats
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_STYUUywBrbvFan', // Updated real test key
        amount: orderData.amount,
        currency: 'INR',
        name: 'CineMax',
        description: `Booking for ${selectedSeats.length} seats`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/bookings/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId
            });

            if (verifyRes.data.success) {
              navigate('/my-bookings');
            }
          } catch (verifyError) {
            console.error('Payment Verification Failed', verifyError);
            alert('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1' // primary-color
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setProcessing(false);
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error('Error initiating payment', error);
      alert(error.response?.data?.message || 'Error processing payment');
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>Select Your Seats</h2>
      
      <div className="glass" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          width: '80%', height: '80px', margin: '0 auto 4rem auto', 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          position: 'relative',
          borderTop: '2px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10px'
        }}>
          <span style={{ color: 'var(--text-secondary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Screen</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
          {rows.map(row => (
            <div key={row} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ width: '20px', color: 'var(--text-secondary)', fontWeight: 600 }}>{row}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {columns.map(col => {
                  const seatId = `${row}${col}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  let bg = 'var(--surface-color)';
                  let hoverBg = 'var(--surface-hover)';
                  let cursor = 'pointer';
                  let border = '1px solid var(--border-color)';

                  if (isBooked) {
                    bg = 'rgba(239, 68, 68, 0.2)'; // danger red
                    border = '1px solid rgba(239, 68, 68, 0.5)';
                    cursor = 'not-allowed';
                    hoverBg = bg;
                  } else if (isSelected) {
                    bg = 'var(--primary-color)';
                    hoverBg = 'var(--primary-hover)';
                    border = '1px solid var(--primary-color)';
                  }

                  return (
                    <motion.div
                      key={seatId}
                      whileHover={!isBooked ? { scale: 1.1 } : {}}
                      whileTap={!isBooked ? { scale: 0.95 } : {}}
                      onClick={() => toggleSeat(seatId)}
                      style={{
                        width: '35px', height: '35px',
                        borderRadius: '6px',
                        background: bg,
                        border: border,
                        cursor: cursor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 500,
                        transition: 'background 0.2s ease',
                      }}
                      title={isBooked ? 'Booked' : seatId}
                    >
                      {/* {col} */}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--primary-color)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Booked</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Selected: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total: <span style={{ color: 'var(--secondary-color)' }}>{selectedSeats.length > 0 ? "₹" + (selectedSeats.length * 100) : '₹0'}</span></p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handlePayment} 
            disabled={selectedSeats.length === 0 || processing}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
          >
            {processing ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
