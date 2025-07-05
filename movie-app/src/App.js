import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const getMovieRequest = async (searchValue) => {
		const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;
;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};

  useEffect(() => {
    getMovieRequest("Avengers");
  }, []);

	useEffect(() => {
		getMovieRequest(searchValue);
	}, [searchValue]);

	useEffect(() => {
		const movieFavourites = JSON.parse(
			localStorage.getItem('react-movie-app-favourites')
		);
		if (movieFavourites) {
			setFavourites(movieFavourites);
		}
	}, []);

	const saveToLocalStorage = (items) => {
		localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
	};

	const addFavouriteMovie = (movie) => {
		if (favourites.some(fav => fav.imdbID === movie.imdbID)) return;
		const newFavouriteList = [...favourites, movie];
		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);
		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	const handleMovieClick = async (movie) => {
    try {
      const url = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=263d22d8`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedMovie(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };


	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Movies' />
				<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieList
					movies={movies}
					handleFavouritesClick={addFavouriteMovie}
					handleMovieClick={handleMovieClick}
					favouriteComponent={AddFavourites}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>
			<div className='row'>
				<MovieList
					movies={favourites}
					handleFavouritesClick={removeFavouriteMovie}
					handleMovieClick={handleMovieClick}
					favouriteComponent={RemoveFavourites}
				/>
			</div>
			{showModal && selectedMovie && (
        <div className="movie-modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{selectedMovie.Title}</h2>
            {/* <img src={selectedMovie.Poster} alt={selectedMovie.Title} /> */}
            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>IMDb Rating:</strong> {selectedMovie.imdbRating}</p>
            <p><strong>Runtime:</strong> {selectedMovie.Runtime}</p>
            <button
              className="trailer-button"
              onClick={() =>
              window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.Title + ' trailer')}`, '_blank')}
              >🎬 Watch Trailer
            </button>

          </div>
        </div>
      )}

		</div>
	);
};

export default App;
