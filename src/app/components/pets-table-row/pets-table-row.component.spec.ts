import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsTableRowComponent } from './pets-table-row.component';

describe('PetsTableRowComponent', () => {
  let component: PetsTableRowComponent;
  let fixture: ComponentFixture<PetsTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetsTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
