import {HttpClient} from "./http-client";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class HttpClientService extends HttpClient {
  addPet(pet: object): Observable<any> {
    return of(null);
  }

  deletePet(petId: number): Observable<any> {
    return of(null);
  }

  editPet(petId: number): Observable<any> {
    return of(null);
  }

  getPet(petId: number): Observable<any> {
    return of(null);
  }

  getPetsByStatus(status: string): Observable<any> {
    return of(null);
  }
}
