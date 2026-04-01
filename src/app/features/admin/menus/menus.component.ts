import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MenusService } from '../../../core/services/menus.service';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Menu } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDialogModule
  ],
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenusComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private menusService = inject(MenusService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  menuDetails: Menu = { title: '', url: '' };
  dataSource = new MatTableDataSource<Menu>();
  readonly displayedColumns = ['id', 'title', 'url', 'actions'];

  ngOnInit(): void {
    this.menusService
      .getMenus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menus) => {
        this.dataSource.data = menus;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async addMenu(): Promise<void> {
    const title = this.menuDetails.title.trim();
    const url = this.menuDetails.url.trim();
    if (!title || !url) {
      return;
    }

    await this.menusService.addMenu({ title, url });
    this.menuDetails = { title: '', url: '' };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteMenu(menuId?: string): void {
    if (!menuId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '300px' });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (confirmed) => {
        if (confirmed === 'true') {
          await this.menusService.deleteMenu(menuId);
        }
      });
  }
}
