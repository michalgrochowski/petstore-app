import {Component, Inject} from '@angular/core';
import {Pet} from "../../models/pet";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

interface DialogData {
  pet: Pet;
}

@Component({
  selector: 'app-add-edit-pet-dialog',
  templateUrl: './add-edit-pet-dialog.component.html',
  styleUrl: './add-edit-pet-dialog.component.scss',
  standalone: false
})
export class AddEditPetDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly dialog: MatDialog,
              private readonly dialogRef: MatDialogRef<AddEditPetDialogComponent>) {
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close();
  }
}
