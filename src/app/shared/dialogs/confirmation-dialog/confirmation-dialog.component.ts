import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Please confirm</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Cancel</button>
      <button mat-raised-button color="warn" mat-dialog-close="true">Yes, Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {}
