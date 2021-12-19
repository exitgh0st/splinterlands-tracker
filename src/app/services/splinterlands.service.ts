import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SplinterlandsSettings } from '../interfaces/splinterlands-settings';

@Injectable({
  providedIn: 'root'
})
export class SplinterlandsService {

  constructor(private http: HttpClient) { }

  fetchSettings() {
    return this.http.get<SplinterlandsSettings>("https://api2.splinterlands.com/settings");
  }
}
