import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from '../../shared/layout/navbar/navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule,
    MatToolbarModule, NavbarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  links = [
    { name: 'Dashboard', link: 'dashboard', icon: 'dashboard' },
    { name: 'Menus', link: 'menus', icon: 'menu' },
    { name: 'Posts', link: 'posts', icon: 'article' }
  ];
}
