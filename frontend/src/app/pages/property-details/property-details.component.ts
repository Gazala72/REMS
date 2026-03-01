import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, MapPin, Bed, Bath, Square, User, Calendar, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  property: any = null;
  loading = true;
  bookingDate = '';
  messageText = '';
  feedback = '';

  readonly MapPinIcon = MapPin;
  readonly BedIcon = Bed;
  readonly BathIcon = Bath;
  readonly SquareIcon = Square;
  readonly UserIcon = User;
  readonly CalendarIcon = Calendar;
  readonly CheckCircleIcon = CheckCircle;

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
}
