import { Injectable } from '@angular/core';

import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class Favorites {

  private storageKey = 'moviehub_favorites';

  getFavorites(): Movie[] {

    const favorites = localStorage.getItem(this.storageKey);

    if (!favorites) {
      return [];
    }

    return JSON.parse(favorites) as Movie[];
  }

  addFavorite(movie: Movie): void {

    const favorites = this.getFavorites();

    const alreadyExists = favorites.some(
      favorite => favorite.id === movie.id
    );

    if (alreadyExists) {
      return;
    }

    favorites.push(movie);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(favorites)
    );
  }

  removeFavorite(movieId: number): void {

    const favorites = this.getFavorites();

    const updatedFavorites = favorites.filter(
      movie => movie.id !== movieId
    );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updatedFavorites)
    );
  }

  isFavorite(movieId: number): boolean {

    const favorites = this.getFavorites();

    return favorites.some(
      movie => movie.id === movieId
    );
  }
}