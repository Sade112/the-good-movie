import React from 'react'
import { useState, useEffect } from 'react';
import "./Series.css"

const Series = ({ isLoggedIn, setIsLoggedIn }) => {
  const [topMovies, setTopMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [netflixFilter, setNetflixFilter] = useState(false);
  const [yearFilter, setYearFilter] = useState({ start: '', end: '' });
  const yearOptions = ['2023', '2022', '2021', '2020', '2015', '2010', '2005', '2000', '1990', '1980'];

  useEffect(() => {
    async function getTopMoviesOnNetflix() {
      try {
        const apiKey = 'cb87c9598ca79fd10544f77de17427a8';
        const response = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=es-ES&page=${page}`),
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=es-ES&page=${page+1}`),
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=es-ES&page=${page+2}`)
        ]);
        const data = await Promise.all(response.map(response => response.json()));
        const results = data.flatMap((d) => d.results);
        if (!results) {
          throw new Error('La respuesta de TMDb no tiene la propiedad "results"');
        }
        const topMovies = results.slice(0, 60);
        for (const movie of topMovies) {
          const movieResponse = await fetch(`https://api.themoviedb.org/3/tv/${movie.id}/watch/providers?api_key=${apiKey}`);
          const movieData = await movieResponse.json();
          if (!movieData.results['ES'] || !movieData.results['ES'].flatrate || !movieData.results['ES'].flatrate.some(provider => provider.provider_name === 'Netflix')) {
            movie.netflix = false;
          } else {
            movie.netflix = true;
          }
        }
        setTopMovies(topMovies);
      } catch (error) {
        console.error('Ha ocurrido un error:', error.message);
      }
    }

    getTopMoviesOnNetflix();
  }, [page]);

  const handlePrevPage = () => {
    setPage(page - 3);
    scrollToTop()
  };

  const handleNextPage = () => {
    setPage(page + 3);
    scrollToTop()
  };

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  const handleNetflixFilterChange = (event) => {
    setNetflixFilter(event.target.checked);
  }

  const handleYearFilterChange = (event) => {
    const { name, value } = event.target;
    setYearFilter({ ...yearFilter, [name]: value });
  };
  
  const filteredMovies = topMovies.filter((movie) => {
    if (netflixFilter && !movie.netflix) {
      return false;
    }
    if (yearFilter.start && new Date(movie.first_air_date).getFullYear() < parseInt(yearFilter.start)) {
      return false;
    }
    if (yearFilter.end && new Date(movie.first_air_date).getFullYear() > parseInt(yearFilter.end)) {
      return false;
    }
    return true;
  });


  return (
    <div className="Pelis">
      <h1>The Good Show</h1>
      {isLoggedIn ? (
    <div>
      <div className="filters">
        <div className="filter">
          <label htmlFor="netflix-filter">Disponible en Netflix:</label>
          <input type="checkbox" id="netflix-filter" checked={netflixFilter} onChange={() => setNetflixFilter(!netflixFilter)} />
        </div>
        <div className="filter">
          <label htmlFor="start-year-filter">Año desde:</label>
          <select id="start-year-filter" name="start" value={yearFilter.start} onChange={handleYearFilterChange}>
            <option value="">Todos los años</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="filter">
          <label htmlFor="end-year-filter">Año hasta:</label>
          <select id="end-year-filter" name="end" value={yearFilter.end} onChange={handleYearFilterChange}>
            <option value="">Todos los años</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

      </div>
      {filteredMovies.map((movie, index) => (
        <div key={movie.id} className="movie-container">
          <div className="movie-info-left">
            {/* <span className="movie-rank">{(page - 1) * 20 + index + 1}</span> */}
            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={`Poster de ${movie.name}`} />
          </div>
          <div className="movie-info-right">
            <h2 className="movie-title">{movie.name}</h2>
            <p className="movie-rating">Nota: {movie.vote_average}</p>
            <p className="movie-overview">{movie.overview}</p>
            {movie.netflix && (
              <p className="movie-netflix-available">Disponible en Netflix</p>
            )}
            {!movie.netflix && (
              <p className="movie-netflix-unavailable">No disponible en Netflix</p>
            )}
            <p className="movie-release-date">Año de lanzamiento: {movie.first_air_date.slice(0, 4)}</p>
          </div>
        </div>
      ))}
      <div className="pagination">
        <button disabled={page === 1} onClick={handlePrevPage}>
          Anterior
        </button>
        <button onClick={handleNextPage}>Siguiente</button>
      </div>
    </div>
  ) : (
    <div>
      <p>Debes iniciar sesión para ver esta página.</p>
      <button onClick={() => setIsLoggedIn(true)}>Iniciar sesión</button>
    </div>
  )}
    </div>
  );
}

export default Series
