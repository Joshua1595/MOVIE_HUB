import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Favorites as FavoritesService } from '../../services/favorites';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-favorites',
  imports: [MovieCard, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {

  private favoritesService = inject(FavoritesService);

  movies: Movie[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.movies = this.favoritesService.getFavorites();
  }
}