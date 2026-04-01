import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenusService } from '../../../core/services/menus.service';
import { PostsService } from '../../../core/services/posts.service';
import { Post } from '../../../core/models/post.model';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private menusService = inject(MenusService);
  private postsService = inject(PostsService);
  private destroyRef = inject(DestroyRef);

  postsList: Post[] = [];

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.menusService.getMenusByUrl(params['url'])),
        switchMap((menus) => {
          const menuId = menus[0]?.id;
          if (!menuId) {
            return of([] as Post[]);
          }

          return this.postsService.getPostsByMenuId(menuId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((posts) => {
        this.postsList = posts;
      });
  }
}
