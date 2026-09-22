import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {

  searchQuery = '';

  @Output() search = new EventEmitter<string>();

  onSearch(): void {

    const query = this.searchQuery.trim();

    if (!query) {
      return;
    }

    this.search.emit(query);
  }
}