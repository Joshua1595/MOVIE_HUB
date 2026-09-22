import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

import { Movie } from '../../models/movie';
import { Favorites as FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {

  @Input() movie!: Movie;

  private favoritesService = inject(FavoritesService);

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  toggleFavorite(event: Event): void {

    event.preventDefault();
    event.stopPropagation();

    if (this.isFavorite()) {

      this.favoritesService.removeFavorite(this.movie.id);

    } else {

      this.favoritesService.addFavorite(this.movie);

    }
  }
}