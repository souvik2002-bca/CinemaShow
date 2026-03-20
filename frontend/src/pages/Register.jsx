import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const { requestRegisterOTP, registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    const res = await requestRegisterOTP(email);
    if (res.success) {
      setStep(2);
      setMsg(res.message);
    } else {
      setError(res.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const res = await registerUser(name, email, password, otp);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <motion.div 
        className="glass" 
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
          Create Account
        </h2>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        {msg && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{msg}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="text" 
                className="input-glass" 
                placeholder="Full Name" 
                style={{ paddingLeft: '2.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="email" 
                className="input-glass" 
                placeholder="Email Address" 
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="password" 
                className="input-glass" 
                placeholder="Password" 
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Verification OTP'} <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem' }}>Enter the OTP sent to {email}</p>
            <div style={{ position: 'relative' }}>
              <KeyRound size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="text" 
                className="input-glass" 
                placeholder="Enter 6-digit OTP" 
                style={{ paddingLeft: '2.5rem', letterSpacing: '4px', textAlign: 'center' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Register'} <ArrowRight size={18} />
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }} 
              onClick={() => { setStep(1); setMsg(''); setError(''); }}
            >
              Back
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
