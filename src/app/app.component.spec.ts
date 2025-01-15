import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../test/test-store";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {PetsTableComponent} from "./components/pets-table/pets-table.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {
  MatCell,
  MatCellDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRowDef,
  MatTableModule
} from "@angular/material/table";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MatOptionModule} from "@angular/material/core";
import {CommonModule} from "@angular/common";

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent,
        PetsTableComponent
      ],
      providers: [
        provideMockStore({initialState}),
        provideAnimationsAsync(),
        provideAnimations()
      ],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule,
        MatOptionModule,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatCellDef,
        MatRowDef,
        MatHeaderRow,
        CommonModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
