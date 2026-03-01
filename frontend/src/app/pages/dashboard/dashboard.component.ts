import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { AddPropertyFormComponent } from '../../components/add-property-form/add-property-form.component';
import { LucideAngularModule, Plus, Inbox, Home } from 'lucide-angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, LucideAngularModule, AddPropertyFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  data: any = null;
  loading = true;
  showAddPropertyForm = false;

  readonly PlusIcon = Plus;
  readonly InboxIcon = Inbox;
  readonly HomeIcon = Home;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        if (user.role === 'owner') {
          forkJoin({
            properties: this.apiService.getOwnerProperties(),
            bookings: this.apiService.getOwnerBookings(),
            messages: this.apiService.getMessages()
          }).subscribe({
            next: (res: any) => {
              this.data = {
                properties: res.properties.data,
                bookings: res.bookings.data,
                messages: res.messages.data
              };
              this.loading = false;
            }
          });
        } else {
          forkJoin({
            bookings: this.apiService.getMyBookings(),
            messages: this.apiService.getMessages()
          }).subscribe({
            next: (res: any) => {
              this.data = {
                bookings: res.bookings.data,
                messages: res.messages.data
              };
              this.loading = false;
            }
          });
        }
      }
    });
  }

  addProperty() {
    this.showAddPropertyForm = true;
  }

  onPropertyAdded(newProperty: any) {
    if (this.data && this.data.properties) {
      this.data.properties.unshift(newProperty);
    }
  }
}
