import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const SelectedMovie = ({
  movieId,
  children,
  KEY,
  handleOnCloseMovie,
}) => {
  const [movie, setMovie] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoding] = useState(false);
  const {
    Title: title,
    Released: released,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoding(true);
        setError('');
        const res =
          await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${movieId}
      `);
        if (!res.ok) {
          throw new Error('Something went Wrong');
        }
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error('Movie not found');
        }
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoding(false);
      }
    };
    fetchData();
  }, [movieId, KEY]);

  return error ? (
    <ErrorMessage error={error} />
  ) : isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleOnCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`${title} poster`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">{children}</div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starruing {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
};

export default SelectedMovie;
