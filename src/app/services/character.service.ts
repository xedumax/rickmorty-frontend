import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'http://localhost:8080/api/characters'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getAllCharacters(page: number = 1): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.apiUrl}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  searchCharacterByName(name: string): Observable<Character[]> {
    // Usa HttpParams para construir correctamente los query parameters
    const params = new HttpParams().set('name', name);
    
    return this.http.get<Character[]>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
          break;
        case 404:
          errorMessage = 'Personaje no encontrado.';
          break;
        case 500:
          errorMessage = 'Error en el servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}