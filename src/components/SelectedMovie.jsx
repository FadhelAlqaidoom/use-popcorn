import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StarRating from './StarRating';

const SelectedMovie = ({
  movieId,
  KEY,
  onCloseMovie,
  onAddWatched,
}) => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoding] = useState(false);
  const [selected, setSelected] = useState(0);

  if (movie !== null) {
    var {
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
  }
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
    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMovie();
      }
    }
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    if (movieId === null) {
      setMovie('');
      setError('');
      setIsLoding(false);
    } else {
      const controller = new AbortController();
      const fetchData = async () => {
        try {
          setIsLoding(true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${movieId}
      `,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error('Something went Wrong');
          }
          const data = await res.json();
          setMovie(data);
          setError('');
          document.title = data.Title;
        } catch (err) {
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoding(false);
        }
      };
      fetchData();

      return () => {
        document.title = 'usePopcorn';
        controller.abort();
      };
    }
  }, [movieId, KEY]);

  return error ? (
    <ErrorMessage error={error} />
  ) : isLoading ? (
    <Loader />
  ) : movie ? (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
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
                onCloseMovie();
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
  ) : null;
};

export default SelectedMovie;
