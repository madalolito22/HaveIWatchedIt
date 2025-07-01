import React from 'react';
import MovieList from './movieList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Have I Watched It?</h1>
        <p className="subtitle">Your personal movie and series tracker</p>
      </header>
      <main className="app-main">
        <MovieList />
      </main>
      <footer className="app-footer">
        <p>© 2024 Have I Watched It? All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;