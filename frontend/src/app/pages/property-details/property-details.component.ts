import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, MapPin, Bed, Bath, Square, User, Calendar, CheckCircle, Edit, Trash2 } from 'lucide-angular';
import { AddPropertyFormComponent } from '../../components/add-property-form/add-property-form.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, AddPropertyFormComponent],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  property: any = null;
  loading = true;
  bookingDate = '';
  messageText = '';
  feedback = '';
  showEditForm = false;

  readonly MapPinIcon = MapPin;
  readonly BedIcon = Bed;
  readonly BathIcon = Bath;
  readonly SquareIcon = Square;
  readonly UserIcon = User;
  readonly CalendarIcon = Calendar;
  readonly CheckCircleIcon = CheckCircle;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash2;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getProperty(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.property = res.data;
            }
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    });
  }

  handleBooking(e: Event) {
    e.preventDefault();
    this.apiService.createBooking({ propertyId: this.property._id, bookingDate: this.bookingDate }).subscribe({
      next: (res) => {
        if (res.success) {
          this.feedback = 'Booking requested successfully!';
          this.bookingDate = '';
        }
      },
      error: (err) => {
        this.feedback = err.error?.message || 'Error occurred';
      }
    });
  }

  handleMessage(e: Event) {
    e.preventDefault();
    this.apiService.sendMessage({ receiverId: this.property.ownerId._id, propertyId: this.property._id, text: this.messageText }).subscribe({
      next: (res) => {
        if (res.success) {
          this.feedback = 'Message sent successfully!';
          this.messageText = '';
        }
      },
      error: (err) => {
        this.feedback = err.error?.message || 'Error occurred';
      }
    });
  }

  editProperty() {
    this.showEditForm = true;
  }

  deleteProperty() {
    if (confirm('Are you sure you want to delete this property?')) {
      this.apiService.deleteProperty(this.property._id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Property deleted successfully.');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete property');
        }
      });
    }
  }

  onPropertyUpdated(updatedProperty: any) {
    this.property = updatedProperty;
    this.showEditForm = false;
  }
}
