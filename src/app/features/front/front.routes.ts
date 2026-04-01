import { Routes } from '@angular/router';
import { FrontComponent } from './front.component';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages/pages.component';

export const FRONT_ROUTES: Routes = [
  {
    path: '',
    component: FrontComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'pages/:url', component: PagesComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
