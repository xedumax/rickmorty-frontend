import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CharacterListComponent } from './character-list.component';
import { CharacterService } from '../../services/character.service';
import { of, throwError } from 'rxjs';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let service: CharacterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterListComponent, HttpClientTestingModule],
      providers: [
        CharacterService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CharacterService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
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

    spyOn(service, 'getAllCharacters').and.returnValue(of(mockCharacters));

    component.ngOnInit();

    expect(service.getAllCharacters).toHaveBeenCalled();
    expect(component.characters.length).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading characters', () => {
    const errorMessage = 'Error loading characters';
    spyOn(service, 'getAllCharacters').and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.ngOnInit();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBe(false);
  });

  it('should navigate to next page', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    
    const mockCharacters = [{
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
    }];
    
    spyOn(service, 'getAllCharacters').and.returnValue(of(mockCharacters));

    component.nextPage();

    expect(service.getAllCharacters).toHaveBeenCalled();
  });

  it('should not navigate to next page if on last page', () => {
    component.currentPage = 5;
    component.totalPages = 5;
    
    spyOn(service, 'getAllCharacters');

    component.nextPage();

    expect(service.getAllCharacters).not.toHaveBeenCalled();
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    
    const mockCharacters = [{
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    }];
    
    spyOn(service, 'getAllCharacters').and.returnValue(of(mockCharacters));

    component.previousPage();

    expect(service.getAllCharacters).toHaveBeenCalled();
  });

  it('should get correct status color', () => {
    expect(component.getStatusColor('Alive')).toBe('#55cc44');
    expect(component.getStatusColor('Dead')).toBe('#d63d2e');
    expect(component.getStatusColor('unknown')).toBe('#9e9e9e');
  });

  it('should retry loading characters', () => {
    component.currentPage = 1;
    const mockCharacters = [{
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    }];
    
    spyOn(service, 'getAllCharacters').and.returnValue(of(mockCharacters));

    component.retry();

    expect(service.getAllCharacters).toHaveBeenCalled();
    expect(component.error).toBeNull();
  });
});