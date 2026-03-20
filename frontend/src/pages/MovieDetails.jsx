import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, Calendar, Film } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`),
          axios.get(`http://localhost:5000/api/shows?movie=${id}`)
        ]);
        setMovie(movieRes.data);
        
        // Group shows by date
        const grouped = showsRes.data.reduce((acc, show) => {
          const dateStr = new Date(show.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          if (!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(show);
          return acc;
        }, {});
        
        setShows(grouped);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMovieAndShows();
  }, [id]);

  if (loading || !movie) return <div className="flex-center" style={{ height: '60vh' }}>Loading details...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: '1 1 300px' }}>
          <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }} />
        </div>
        <div style={{ flex: '2 1 500px', padding: '3rem' }}>
          <span style={{ color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
            {movie.genre}
          </span>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            {movie.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> {movie.duration} Minutes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {new Date(movie.releaseDate).toLocaleDateString()}</span>
          </div>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>{movie.description}</p>
          
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Select Showtime</h3>
          
          {Object.keys(shows).length === 0 ? (
            <p>No shows available for this movie.</p>
          ) : (
            Object.keys(shows).map(date => (
              <div key={date} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{date}</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {shows[date].map(show => (
                    <Link 
                      key={show._id} 
                      to={`/show/${show._id}/seats`}
                      className="btn btn-outline"
                      style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem 1.25rem' }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{show.time}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{show.screen}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
