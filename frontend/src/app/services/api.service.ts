import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Properties
  getProperties(paramsObj: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key]) {
        params = params.set(key, paramsObj[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/properties`, { params });
  }

  getProperty(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/${id}`);
  }

  createProperty(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/properties`, data);
  }

  updateProperty(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/properties/${id}`, data);
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getOwnerProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/owner/me`);
  }

  getAllPropertiesAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/admin/all`);
  }

  approveProperty(id: string, approved: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/properties/${id}/approve`, { approved });
  }

  // Bookings
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, data);
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/my-bookings`);
  }

  getOwnerBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/owner-bookings`);
  }

  // Messages
  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, data);
  }

  getMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages`);
  }

  // Users (Admin)
  getAdminAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/admin/analytics`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
