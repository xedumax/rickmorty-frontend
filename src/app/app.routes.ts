import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterSearchComponent } from './components/character-search/character-search.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: CharacterListComponent },
  { path: 'search', component: CharacterSearchComponent },
  { path: '**', component: NotFoundComponent }
];