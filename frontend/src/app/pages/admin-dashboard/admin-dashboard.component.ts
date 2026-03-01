import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  data: any = null;
  loading = true;

  ngOnInit() {
    this.fetchAdminData();
  }

  fetchAdminData() {
    this.loading = true;
    forkJoin({
      analytics: this.apiService.getAdminAnalytics(),
      properties: this.apiService.getAllPropertiesAdmin(),
      users: this.apiService.getUsers()
    }).subscribe({
      next: (res: any) => {
        this.data = {
          analytics: res.analytics.data,
          properties: res.properties.data,
          users: res.users.data
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  handleApproveProperty(id: string, approved: boolean) {
    this.apiService.approveProperty(id, approved).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchAdminData();
        }
      }
    });
  }

  handleDeleteUser(id: string) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    this.apiService.deleteUser(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchAdminData();
        }
      }
    });
  }
}
