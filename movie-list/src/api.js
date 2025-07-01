const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchMovies = async () => {
  try {
    const response = await fetch(`${API_URL}/movies`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies. Please make sure JSON Server is running on port 3000.');
  }
};

export const toggleWatched = async (id, currentStatus) => {
  try {
    const newStatus = currentStatus === 'Visto' ? 'Pendiente' : 'Visto';
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Estado: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating movie status:', error);
    throw new Error('Failed to update movie status. Please try again.');
  }
};