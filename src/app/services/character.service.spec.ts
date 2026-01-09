import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { Character } from '../models/character.model';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/characters';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CharacterService]
    });
    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all characters', () => {
    const mockCharacters: Character[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
      }
    ];

    service.getAllCharacters(1).subscribe(characters => {
      expect(characters.length).toBe(1);
      expect(characters[0].name).toBe('Rick Sanchez');
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should get character by id', () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    };

    service.getCharacterById(1).subscribe(character => {
      expect(character.id).toBe(1);
      expect(character.name).toBe('Rick Sanchez');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should handle 404 error when character not found', (done) => {
    service.getCharacterById(999).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.message).toContain('Personaje no encontrado');
        done();
      }
    });

    // El servicio hace retry(2), así que esperamos 3 peticiones en total
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    }
  });

  it('should handle server error (500)', (done) => {
    service.getAllCharacters(1).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.message).toContain('Error en el servidor');
        done();
      }
    });

    // El servicio hace retry(2), así que esperamos 3 peticiones en total
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    }
  });

  it('should search character by name', () => {
    const mockCharacters: Character[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
      }
    ];

    service.searchCharacterByName('Rick').subscribe(characters => {
      expect(characters.length).toBeGreaterThan(0);
      expect(characters[0].name).toContain('Rick');
    });

    const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('name') === 'Rick');
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should handle connection error', (done) => {
    service.getAllCharacters(1).subscribe({
      next: () => fail('should have failed with connection error'),
      error: (error) => {
        expect(error.message).toContain('No se pudo conectar con el servidor');
        done();
      }
    });

    // El servicio hace retry(2), así que esperamos 3 peticiones en total
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne(`${apiUrl}`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    }
  });
});