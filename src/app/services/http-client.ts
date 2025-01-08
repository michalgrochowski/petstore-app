import {Observable} from "rxjs";

export abstract class HttpClient {
  abstract getPetsByStatus(status: string): Observable<any>;

  abstract getPet(petId: number): Observable<any>;

  abstract addPet(pet: object): Observable<any>;

  abstract editPet(petId: number): Observable<any>;

  abstract deletePet(petId: number): Observable<any>;
}
