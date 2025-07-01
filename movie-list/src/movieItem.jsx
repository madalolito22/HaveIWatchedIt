import React from 'react';
import './MovieItem.css';

const MovieItem = ({ movie, onToggle, style }) => {
  // The image URL now comes directly from db.json as a local path
  const imageUrl = movie.image || '/placeholder.svg';

  return (
    <div
      className={`movie-card ${movie.Estado === 'Visto' ? 'watched' : ''}`}
      style={style}
    >
      <figure className="movie-card__poster">
        <img
          src={imageUrl}
          alt={movie.Título}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if placeholder is also missing
            e.target.src = '/placeholder.svg';
          }}
          loading="lazy"
        />
      </figure>
      <div className="movie-card__content">
        <div className="movie-card__header">
          <h3 className="movie-card__title">{movie.Título}</h3>
          <div className="movie-card__status">
            <label className="switch">
              <input
                type="checkbox"
                checked={movie.Estado === 'Visto'}
                onChange={onToggle}
                aria-label={`Mark ${movie.Título} as ${movie.Estado === 'Visto' ? 'Pendiente' : 'Visto'}`}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="movie-card__info">
          <p className="movie-card__year">{movie['Año/Eventos']}</p>
          <p className="movie-card__type">{movie.Tipo}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;