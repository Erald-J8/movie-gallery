import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'info-dialog',
  templateUrl: './info-dialog.component.html'
})
export class InfoDialogComponent {
    posterUrl: string = ""
    imdbUrl: string = ""

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<InfoDialogComponent>) {
        if (data) {
            this.posterUrl = data.posterUrl || this.posterUrl;
            this.imdbUrl = data.imdbUrl || this.imdbUrl;
        }
        this.dialogRef.updateSize('400px','600px')
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }
}