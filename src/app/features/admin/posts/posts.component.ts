import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PostsService } from '../../../core/services/posts.service';
import { MenusService } from '../../../core/services/menus.service';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Post } from '../../../core/models/post.model';
import { Menu } from '../../../core/models/menu.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatDialogModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private postsService = inject(PostsService);
  private menusService = inject(MenusService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  menusList: Menu[] = [];
  dataSource = new MatTableDataSource<Post>();
  readonly displayedColumns = ['id', 'title', 'menu_id', 'content', 'actions'];

  postForm = this.fb.group({
    title: ['', Validators.required],
    menu_id: ['', Validators.required],
    content: ['', Validators.required]
  });

  ngOnInit(): void {
    this.postsService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.dataSource.data = posts;
      });

    this.menusService
      .getMenus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menus) => {
        this.menusList = menus;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async addPost(): Promise<void> {
    if (this.postForm.invalid) {
      return;
    }

    const postValue = this.postForm.getRawValue() as Omit<Post, 'id'>;
    await this.postsService.addPost(postValue);
    this.postForm.reset();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMenuTitle(menuId: string): string {
    return this.menusList.find(m => m.id === menuId)?.title || menuId;
  }

  deletePost(postId?: string): void {
    if (!postId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '300px' });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (confirmed) => {
        if (confirmed === 'true') {
          await this.postsService.deletePost(postId);
        }
      });
  }
}
