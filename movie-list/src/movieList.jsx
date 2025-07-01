import React, { useState, useEffect } from 'react';
import MovieItem from './movieItem';
import { fetchMovies, toggleWatched } from './api';
import './App.css';

const MovieList = () => {
  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies();

      const categorizedMovies = data.reduce((acc, movie) => {
        const category = movie.parent || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(movie);
        return acc;
      }, {});
      
      const orderedCategories = {
        'MARVEL UCM ORDERED': categorizedMovies.Marvel || [],
        ...Object.keys(categorizedMovies).reduce((acc, key) => {
          if (key !== 'Marvel') {
            acc[key] = categorizedMovies[key];
          }
          return acc;
        }, {})
      };
      
      setMoviesByCategory(orderedCategories);
    } catch (err) {
      setError(err.message);
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      const updatedMovie = await toggleWatched(id, currentStatus);
      
      // Create a new state object to ensure re-render
      const newMoviesByCategory = { ...moviesByCategory };
      
      for (const category in newMoviesByCategory) {
        newMoviesByCategory[category] = newMoviesByCategory[category].map(movie =>
          movie.id === id ? updatedMovie : movie
        );
      }
      
      setMoviesByCategory(newMoviesByCategory);
    } catch (err) {
      setError(err.message);
      console.error('Error toggling movie status:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadMovies}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="movies-container">
      {Object.entries(moviesByCategory).map(([category, movies]) => {
        if (movies.length === 0) return null;
        return (
          <section key={category} className="category-section">
            <h2 className="category-title">{category.replace(/_/g, ' ')}</h2>
            <div className="movie-grid">
              {movies.map((movie, index) => (
                <MovieItem
                  key={movie.id}
                  movie={movie}
                  onToggle={() => handleToggle(movie.id, movie.Estado)}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MovieList;