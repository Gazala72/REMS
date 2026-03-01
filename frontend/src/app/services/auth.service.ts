import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  public loading$ = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private router: Router) {
    this.checkUser();
  }

  get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkUser() {
    const token = this.getToken();
    if (token) {
      this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/me`).subscribe({
        next: (res) => {
          if (res.success) {
            this.userSubject.next({
              id: res.data._id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role
            });
          }
          this.loading$.next(false);
        },
        error: () => {
          this.logout();
          this.loading$.next(false);
        }
      });
    } else {
      this.loading$.next(false);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ success: boolean; token: string; user: any }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          this.userSubject.next(res.user);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<{ success: boolean; token: string; user: any }>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          this.userSubject.next(res.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }
}
