import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StaffServiceService {

  apiBaseUrl = 'https://localhost/';
  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get(`${this.apiBaseUrl}api/countries`);
  }
}
