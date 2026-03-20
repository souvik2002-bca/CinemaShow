import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ movie: '', time: '', date: '', screen: '', price: 100 });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [showsRes, moviesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/shows'),
        axios.get('http://localhost:5000/api/movies')
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/shows/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/shows', formData);
      }
      setFormData({ movie: '', time: '', date: '', screen: '', price: 100 });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (e) {
      alert('Error saving show');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this show?')) {
      try {
        await axios.delete(`http://localhost:5000/api/shows/${id}`);
        fetchData();
      } catch(e) {
        alert('Error deleting show');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 style={{ marginBottom: '2rem' }}>Manage Shows</h2>
      
      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'Edit Show' : 'Schedule New Show'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <select className="input-glass" value={formData.movie} onChange={e=>setFormData({...formData, movie: e.target.value})} required style={{ gridColumn: '1 / -1' }}>
            <option value="" disabled>Select Movie</option>
            {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
          </select>
          <input className="input-glass" placeholder="Time (e.g. 10:00 AM)" value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} required />
          <input className="input-glass" type="date" value={formData.date ? formData.date.substring(0,10) : ''} onChange={e=>setFormData({...formData, date: e.target.value})} required />
          <input className="input-glass" placeholder="Screen" value={formData.screen} onChange={e=>setFormData({...formData, screen: e.target.value})} required />
          <input className="input-glass" placeholder="Price" type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required />
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update Show' : 'Add Show'}</button>
            {isEditing && <button type="button" className="btn btn-outline" onClick={() => { setIsEditing(false); setFormData({ movie: '', time: '', date: '', screen: '', price: 100 }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? <p>Loading...</p> : shows.map(show => (
          <div key={show._id} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{show.movie?.title || 'Unknown Movie'}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {new Date(show.date).toLocaleDateString()} at {show.time} | {show.screen} | ₹{show.price}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setIsEditing(true); setEditId(show._id); setFormData({...show, movie: show.movie?._id}); }}><Edit size={16}/></button>
              <button className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(show._id)}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
export default AdminShows;
