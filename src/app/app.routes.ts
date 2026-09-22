import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MovieDetails } from './pages/movie-details/movie-details';
import { Favorites } from './pages/favorites/favorites';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'movie/:id',
    component: MovieDetails
  },
  {
    path: 'favorites',
    component: Favorites
  },
  {
    path: '**',
    redirectTo: ''
  }
];