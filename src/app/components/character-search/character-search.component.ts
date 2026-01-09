import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../models/character.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-character-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './character-search.component.html',
  styleUrls: ['./character-search.component.css']
})
export class CharacterSearchComponent {
  searchTerm = '';
  character: Character | null = null;
  loading = false;
  error: string | null = null;
  searchType: 'name' | 'id' = 'name';

  constructor(private characterService: CharacterService) {}

  search(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.character = null;

    if (this.searchType === 'id') {
      this.searchById(parseInt(this.searchTerm));
    } else {
      this.searchByName(this.searchTerm);
    }
  }

  private searchById(id: number): void {
    this.characterService.getCharacterById(id).subscribe({
      next: (character) => {
        this.character = character;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  private searchByName(name: string): void {
    this.characterService.searchCharacterByName(name).subscribe({
      next: (characters) => {
        if (characters && characters.length > 0) {
          this.character = characters[0];
        } else {
          this.error = 'No se encontró ningún personaje con ese nombre.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  downloadPDF(): void {
    if (!this.character) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text(this.character.name, pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    let yPosition = 40;

    const addLine = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label + ':', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += 10;
    };

    addLine('ID', this.character.id.toString());
    addLine('Estado', this.character.status);
    addLine('Especie', this.character.species);
    addLine('Género', this.character.gender);
    addLine('Origen', this.character.origin.name);
    addLine('Ubicación', this.character.location.name);

    if (this.character.type) {
      addLine('Tipo', this.character.type);
    }

    doc.save(`${this.character.name.replace(/\s+/g, '_')}.pdf`);
  }

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'alive': return '#55cc44';
      case 'dead': return '#d63d2e';
      default: return '#9e9e9e';
    }
  }
}