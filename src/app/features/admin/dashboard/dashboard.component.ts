import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MenusService } from '../../../core/services/menus.service';
import { PostsService } from '../../../core/services/posts.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private menusService = inject(MenusService);
  private postsService = inject(PostsService);
  private destroyRef = inject(DestroyRef);

  menusCount = 0;
  postsCount = 0;

  ngOnInit(): void {
    this.menusService
      .getMenus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menus) => (this.menusCount = menus.length));

    this.postsService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => (this.postsCount = posts.length));
  }
}
