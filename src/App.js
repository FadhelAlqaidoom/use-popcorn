import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import MoviesList from './components/MoviesList';
import WatchedListSummary from './components/WatchedListSummary';
import NumberResults from './components/NumberResults';
import Box from './components/Box';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import SelectedMovie from './components/SelectedMovie';

const KEY = '6ac5e10b';

// const tempMovieData = [
//   {
//     imdbID: 'tt1375666',
//     Title: 'Inception',
//     Year: '2010',
//     Poster:
//       'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
//   },
//   {
//     imdbID: 'tt0133093',
//     Title: 'The Matrix',
//     Year: '1999',
//     Poster:
//       'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
//   },
//   {
//     imdbID: 'tt6751668',
//     Title: 'Parasite',
//     Year: '2019',
//     Poster:
//       'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
//   },
// ];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoding] = useState(false);
  const [error, setError] = useState('');
  const [movieId, setMovieId] = useState(null);

  const handleAddWatched = (movie) => {
    const exists = watched.some(
      (watch) => movie.movieId === watch.movieId
    );

    if (exists) {
      setWatched(
        watched.map((watch) => {
          return movie.movieId === watch.movieId ? movie : watch;
        })
      );
    } else {
      setWatched([...watched, movie]);
    }
  };

  const handleSelectMovie = (movie) => {
    setMovieId(movie.imdbID);
  };

  const handleOnCloseMovie = () => {
    setMovieId(null);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoding(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query.replace(
            /\s+/g,
            '-'
          )}
      `,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error('Something went Wrong');
        }
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error('Movie not found');
        }
        setMovies(data.Search);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoding(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Navbar query={query} setQuery={setQuery}>
        <NumberResults movies={movies} />
      </Navbar>

      <main className="main">
        <Box>
          {error ? (
            <ErrorMessage error={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MoviesList
              movies={movies}
              setMovies={setMovies}
              setMovieId={setMovieId}
              onClick={handleSelectMovie}
            />
          )}
        </Box>
        <Box>
          {movieId ? (
            <SelectedMovie
              movieId={movieId}
              KEY={KEY}
              onCloseMovie={handleOnCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <WatchedListSummary
              watched={watched}
              setWatched={setWatched}
            />
          )}
        </Box>
      </main>
    </>
  );
}
