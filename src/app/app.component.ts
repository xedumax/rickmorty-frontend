import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav class="main-nav">
      <div class="nav-container">
        <h1 class="nav-title">Rick and Morty App</h1>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .main-nav {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .nav-title {
      color: white;
      font-size: 2rem;
      margin: 0;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
  `]
})
export class AppComponent {
  title = 'rick-morty-frontend';
}