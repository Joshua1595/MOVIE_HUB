import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Movie } from '../models/movie';

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TmdbMovieResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);

  private baseUrl = environment.tmdbBaseUrl;

  private headers = new HttpHeaders({
    Authorization: `Bearer ${environment.tmdbAccessToken}`,
    accept: 'application/json'
  });

  getPopularMovies(page: number = 1): Observable<TmdbMovieResponse> {

    return this.http.get<TmdbMovieResponse>(
      `${this.baseUrl}/movie/popular?language=en-US&page=${page}`,
      {
        headers: this.headers
      }
    );
  }

  searchMovies(
    query: string,
    page: number = 1
  ): Observable<TmdbMovieResponse> {

    return this.http.get<TmdbMovieResponse>(
      `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
      {
        headers: this.headers
      }
    );
  }

  getMovieDetails(id: number): Observable<TmdbMovie> {

    return this.http.get<TmdbMovie>(
      `${this.baseUrl}/movie/${id}?language=en-US`,
      {
        headers: this.headers
      }
    );
  }

  getGenres(): Observable<TmdbGenreResponse> {

    return this.http.get<TmdbGenreResponse>(
      `${this.baseUrl}/genre/movie/list?language=en-US`,
      {
        headers: this.headers
      }
    );
  }

  getMoviesByGenre(
    genreId: number,
    page: number = 1
  ): Observable<TmdbMovieResponse> {

    return this.http.get<TmdbMovieResponse>(
      `${this.baseUrl}/discover/movie?with_genres=${genreId}&language=en-US&page=${page}&sort_by=popularity.desc`,
      {
        headers: this.headers
      }
    );
  }

}