import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies', error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return <div className="flex-center" style={{ height: '60vh' }}>Loading movies...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        Now Showing
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Book tickets for the latest blockbusters.
      </p>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2.5rem', padding: '1rem' 
      }}>
        {movies.map((movie, index) => (
          <motion.div 
            key={movie._id} 
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                className="poster-img"
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <span style={{ background: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' }}>
                  {movie.genre}
                </span>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>{movie.title}</h3>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={16} /> {movie.duration} min
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={16} /> {new Date(movie.releaseDate).getFullYear()}
                </span>
              </div>
              
              <Link to={`/movie/${movie._id}`} className="btn btn-outline" style={{ width: '100%' }}>
                Book Tickets
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
