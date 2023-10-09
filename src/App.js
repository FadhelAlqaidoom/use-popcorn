import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import MoviesList from './components/MoviesList';
import WatchedListSummary from './components/WatchedListSummary';
import NumberResults from './components/NumberResults';
import Box from './components/Box';

import StarRating from './components/StarRating';
import Loader from './components/Loader';

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
  const [query, setQuery] = useState('breaking bad');
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoding(true);
      const res =
        await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query.replace(
          /\s+/g,
          '-'
        )}
    `);
      const data = await res.json();
      setMovies(data.Search);
      setIsLoding(false);
    };
    fetchData();
  }, [query]);

  return (
    <>
      <Navbar>
        <NumberResults movies={movies} />
      </Navbar>
      <StarRating max="10" />

      <main className="main">
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <MoviesList movies={movies} setMovies={setMovies} />
          )}
        </Box>
        <Box>
          <WatchedListSummary
            watched={watched}
            setWatched={setWatched}
          />
        </Box>
      </main>
    </>
  );
}
