import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(page: number = 1): void {
    this.loading = true;
    this.error = null;

    this.characterService.getAllCharacters(page).subscribe({
      next: (characters) => {
        this.characters = characters;
        this.currentPage = page;
        this.totalPages = 1; // Sin paginación por ahora
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadCharacters(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadCharacters(this.currentPage - 1);
    }
  }

  retry(): void {
    this.loadCharacters(this.currentPage);
  }

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'alive': return '#55cc44';
      case 'dead': return '#d63d2e';
      default: return '#9e9e9e';
    }
  }
}