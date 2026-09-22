import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { SearchBar } from '../../components/search-bar/search-bar';
import { MovieCard } from '../../components/movie-card/movie-card';
import { GenreFilter } from '../../components/genre-filter/genre-filter';

import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-home',
  imports: [SearchBar, MovieCard, GenreFilter],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Home implements OnInit {

  private movieService = inject(MovieService);
  private cdr = inject(ChangeDetectorRef);

  movies: Movie[] = [];

  loading = false;
  loadingMore = false;
  error = '';

  searchQuery = '';
  isSearching = false;

  selectedGenreId: number | null = null;
  isGenreSelected = false;

  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {

    this.loading = true;
    this.error = '';

    this.isSearching = false;
    this.isGenreSelected = false;

    this.searchQuery = '';
    this.selectedGenreId = null;

    this.currentPage = 1;

    this.movieService.getPopularMovies(1).subscribe({

      next: (response) => {

        this.movies = this.mapMovies(response.results);

        this.currentPage = response.page;
        this.totalPages = response.total_pages;

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB API error:', error);

        this.error = 'Unable to load movies. Please try again.';
        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  searchMovies(query: string): void {

    this.loading = true;
    this.error = '';

    this.searchQuery = query;

    this.isSearching = true;
    this.isGenreSelected = false;

    this.selectedGenreId = null;

    this.currentPage = 1;

    this.movieService.searchMovies(query, 1).subscribe({

      next: (response) => {

        this.movies = this.mapMovies(response.results);

        this.currentPage = response.page;
        this.totalPages = response.total_pages;

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB search error:', error);

        this.error = 'Unable to search movies. Please try again.';
        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  selectGenre(genreId: number | null): void {

    this.loading = true;
    this.error = '';

    this.isSearching = false;
    this.searchQuery = '';

    this.selectedGenreId = genreId;
    this.isGenreSelected = genreId !== null;

    this.currentPage = 1;

    if (genreId === null) {

      this.loadPopularMovies();

      return;
    }

    this.movieService.getMoviesByGenre(genreId, 1).subscribe({

      next: (response) => {

        this.movies = this.mapMovies(response.results);

        this.currentPage = response.page;
        this.totalPages = response.total_pages;

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB genre error:', error);

        this.error = 'Unable to load movies for this genre.';
        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  loadMore(): void {

    if (this.loadingMore) {
      return;
    }

    if (this.currentPage >= this.totalPages) {
      return;
    }

    const nextPage = this.currentPage + 1;

    this.loadingMore = true;

    let request;

    if (this.isSearching) {

      request = this.movieService.searchMovies(
        this.searchQuery,
        nextPage
      );

    } else if (this.isGenreSelected && this.selectedGenreId !== null) {

      request = this.movieService.getMoviesByGenre(
        this.selectedGenreId,
        nextPage
      );

    } else {

      request = this.movieService.getPopularMovies(nextPage);
    }

    request.subscribe({

      next: (response) => {

        const newMovies = this.mapMovies(response.results);

        this.movies = [
          ...this.movies,
          ...newMovies
        ];

        this.currentPage = response.page;
        this.totalPages = response.total_pages;

        this.loadingMore = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB load more error:', error);

        this.loadingMore = false;

        this.cdr.markForCheck();
      }

    });
  }

  private mapMovies(results: any[]): Movie[] {

    return results.map(movie => ({

      id: movie.id,

      title: movie.title,

      overview: movie.overview,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '',

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : '',

      releaseDate: movie.release_date,

      rating: movie.vote_average,

      genre: []

    }));
  }
}