import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', posterUrl: '', genre: '', duration: '', releaseDate: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`\${import.meta.env.REACT_APP_API_URL}/api/movies`);
      setMovies(res.data);
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
        await axios.put(`\${import.meta.env.REACT_APP_API_URL}/api/movies/${editId}`, formData);
      } else {
        await axios.post(`\${import.meta.env.REACT_APP_API_URL}/api/movies`, formData);
      }
      setFormData({ title: '', description: '', posterUrl: '', genre: '', duration: '', releaseDate: '' });
      setIsEditing(false);
      setEditId(null);
      fetchMovies();
    } catch (e) {
      alert('Error saving movie');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this movie?')) {
      try {
        await axios.delete(`\${import.meta.env.REACT_APP_API_URL}/api/movies/${id}`);
        fetchMovies();
      } catch(e) {
        alert('Error deleting movie');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 style={{ marginBottom: '2rem' }}>Manage Movies</h2>
      
      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'Edit Movie' : 'Add New Movie'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <input className="input-glass" placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required />
          <input className="input-glass" placeholder="Genre" value={formData.genre} onChange={e=>setFormData({...formData, genre: e.target.value})} required />
          <input className="input-glass" placeholder="Duration (mins)" type="number" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} required />
          <input className="input-glass" placeholder="Release Date" type="date" value={formData.releaseDate ? formData.releaseDate.substring(0,10) : ''} onChange={e=>setFormData({...formData, releaseDate: e.target.value})} required />
          <input className="input-glass" placeholder="Poster URL" style={{ gridColumn: '1 / -1' }} value={formData.posterUrl} onChange={e=>setFormData({...formData, posterUrl: e.target.value})} required />
          <textarea className="input-glass" placeholder="Description" rows="3" style={{ gridColumn: '1 / -1' }} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required />
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update Movie' : 'Add Movie'}</button>
            {isEditing && <button type="button" className="btn btn-outline" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '', posterUrl: '', genre: '', duration: '', releaseDate: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? <p>Loading...</p> : movies.map(movie => (
          <div key={movie._id} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={movie.posterUrl} alt={movie.title} style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{movie.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{movie.genre} | {movie.duration} mins</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setIsEditing(true); setEditId(movie._id); setFormData(movie); }}><Edit size={16}/></button>
              <button className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(movie._id)}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
export default AdminMovies;
