import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  MovieService,
  TmdbGenre
} from '../../services/movie';

@Component({
  selector: 'app-genre-filter',
  imports: [],
  templateUrl: './genre-filter.html',
  styleUrl: './genre-filter.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class GenreFilter implements OnInit {

  private movieService = inject(MovieService);
  private cdr = inject(ChangeDetectorRef);

  genres: TmdbGenre[] = [];

  loading = false;
  error = '';

  selectedGenreId: number | null = null;

  @Output() genreSelected = new EventEmitter<number | null>();

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {

    this.loading = true;
    this.error = '';

    this.movieService.getGenres().subscribe({

      next: (response) => {

        console.log('TMDB genres:', response);

        this.genres = response.genres;

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('TMDB genres error:', error);

        this.error = 'Unable to load genres.';
        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  selectGenre(genreId: number | null): void {

    this.selectedGenreId = genreId;

    this.genreSelected.emit(genreId);
  }
}