import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie';
import { Favorites as FavoritesService } from '../../services/favorites';
@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, SlicePipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private cdr = inject(ChangeDetectorRef);
  private favoritesService = inject(FavoritesService);
  movie: Movie | null = null;
  
  loading = false;
  error = '';

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid movie ID.';
      return;
    }

    this.loadMovie(id);
  }

  loadMovie(id: number): void {

    this.loading = true;
    this.error = '';

    this.movieService.getMovieDetails(id).subscribe({

      next: (movie) => {

        this.movie = {
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
        };

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB movie details error:', error);

        this.error = 'Unable to load movie details.';
        this.loading = false;
      }

    });
  }
  addToFavorites(): void {

    if (!this.movie) {
      return;
    }

    this.favoritesService.addFavorite(this.movie);
  }

  removeFromFavorites(): void {

    if (!this.movie) {
      return;
    }

    this.favoritesService.removeFavorite(this.movie.id);
  }

  isFavorite(): boolean {

    if (!this.movie) {
      return false;
    }

    return this.favoritesService.isFavorite(this.movie.id);
  }
}