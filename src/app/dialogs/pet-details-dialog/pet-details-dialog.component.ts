import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Pet} from "../../models/pet";

export interface PetDetailsDialogData {
  pet: Pet
}

@Component({
  selector: 'app-pet-details-dialog',
  standalone: false,
  templateUrl: './pet-details-dialog.component.html',
  styleUrl: './pet-details-dialog.component.scss'
})
export class PetDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PetDetailsDialogData,
              readonly dialogRef: MatDialogRef<PetDetailsDialogComponent>) {
  }

  dialogTitle = `Details for ${this.data.pet?.name}`;

  close(): void {
    this.dialogRef.close();
  }
}
