import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CharacterSearchComponent } from './character-search.component';
import { CharacterService } from '../../services/character.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('CharacterSearchComponent', () => {
  let component: CharacterSearchComponent;
  let fixture: ComponentFixture<CharacterSearchComponent>;
  let service: CharacterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSearchComponent, HttpClientTestingModule],
      providers: [
        CharacterService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterSearchComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CharacterService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search with empty search term', () => {
    component.searchTerm = '';
    spyOn(service, 'getCharacterById');
    spyOn(service, 'searchCharacterByName');

    component.search();

    expect(service.getCharacterById).not.toHaveBeenCalled();
    expect(service.searchCharacterByName).not.toHaveBeenCalled();
  });

  it('should search by id when searchType is id', () => {
    const mockCharacter = {
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

    component.searchType = 'id';
    component.searchTerm = '1';
    
    spyOn(service, 'getCharacterById').and.returnValue(of(mockCharacter));

    component.search();

    expect(service.getCharacterById).toHaveBeenCalledWith(1);
    expect(component.character).toEqual(mockCharacter);
  });

  it('should search by name when searchType is name', () => {
    const mockCharacters = [
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

    component.searchType = 'name';
    component.searchTerm = 'Rick';
    
    spyOn(service, 'searchCharacterByName').and.returnValue(of(mockCharacters));

    component.search();

    expect(service.searchCharacterByName).toHaveBeenCalledWith('Rick');
    expect(component.character).toEqual(mockCharacters[0]);
  });

  it('should handle error when character not found', () => {
    const errorMessage = 'Personaje no encontrado';
    
    component.searchType = 'id';
    component.searchTerm = '999';
    
    spyOn(service, 'getCharacterById').and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.search();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBe(false);
  });

  it('should show error when search by name returns empty results', () => {
    component.searchType = 'name';
    component.searchTerm = 'NonExistent';
    
    spyOn(service, 'searchCharacterByName').and.returnValue(of([]));

    component.search();

    expect(component.error).toContain('No se encontró ningún personaje');
  });

  it('should call downloadPDF when character is loaded', () => {
    component.character = {
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

    spyOn(component, 'downloadPDF');

    component.downloadPDF();

    expect(component.downloadPDF).toHaveBeenCalled();
  });

  it('should get correct status color', () => {
    expect(component.getStatusColor('Alive')).toBe('#55cc44');
    expect(component.getStatusColor('Dead')).toBe('#d63d2e');
    expect(component.getStatusColor('unknown')).toBe('#9e9e9e');
  });
});