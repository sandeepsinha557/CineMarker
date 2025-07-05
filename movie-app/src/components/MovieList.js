import React from 'react';

const MovieList = ({ movies, handleFavouritesClick, handleMovieClick, favouriteComponent }) => {
	const FavouriteComponent = favouriteComponent;

	return (
		<>
			{movies.map((movie, index) => (
				<div
					className='image-container d-flex justify-content-start m-3'
					key={index}
					onClick={() => handleMovieClick(movie)}
				>
					<img
                    src={movie.Poster!=="N/A"?movie.Poster:"https://via.placeholder.com/300x445?text=No+Image"}
                    alt={movie.Title}
                    />

					<div
						onClick={(e) => {
							e.stopPropagation(); // Prevent modal opening
							handleFavouritesClick(movie);
						}}
						className='overlay d-flex align-items-center justify-content-center'
					>
						<FavouriteComponent />
					</div>
				</div>
			))}
		</>
	);
};

export default MovieList;