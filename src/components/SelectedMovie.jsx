import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StarRating from './StarRating';

const SelectedMovie = ({
  movieId,
  KEY,
  OnCloseMovie,
  onAddWatched,
}) => {
  const [movie, setMovie] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoding] = useState(false);
  const [selected, setSelected] = useState(0);
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
  const movieData = {
    title,
    released,
    poster,
    runtime,
    imdbRating,
    plot,
    actors,
    director,
    genre,
    movieId,
  };

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
        <button className="btn-back" onClick={OnCloseMovie}>
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
        <div className="rating">
          <StarRating
            max="10"
            selected={selected}
            setSelected={setSelected}
            userRating={movieData.userRating}
          />
          <button
            className="btn-add"
            onClick={() => {
              if (selected > 0) {
                onAddWatched({ ...movieData, userRating: selected });
                OnCloseMovie();
              }
            }}
          >
            Rate
          </button>
        </div>
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
