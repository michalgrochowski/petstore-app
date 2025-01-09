import {Observable} from "rxjs";
import {Pet} from "../models/pet";

export abstract class ApiClient {

  abstract getPetsByStatus(status: string): Observable<Pet[]>;

  abstract getPet(petId: number): Observable<Pet>;

  abstract addPet(pet: Pet): Observable<Pet>;

  abstract editPet(pet: Pet): Observable<Pet>;

  abstract deletePet(petId: number): Observable<{ code: number, type: string, message: string }>;
}
