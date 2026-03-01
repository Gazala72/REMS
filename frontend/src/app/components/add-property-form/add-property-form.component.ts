import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LucideAngularModule, X } from 'lucide-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './add-property-form.component.html',
  styleUrls: ['./add-property-form.component.scss']
})
export class AddPropertyFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() propertyAdded = new EventEmitter<any>();

  apiService = inject(ApiService);

  formData = {
    title: '',
    description: '',
    price: null,
    location: '',
    type: 'Residential',
    area: null,
    bedrooms: null,
    bathrooms: null,
    amenities: '', // comma separated later
    images: '' // comma separated urls later
  };

  selectedFile: File | null = null;
  loading = false;
  error = '';

  readonly CloseIcon = X;

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    if (this.selectedFile) {
      this.apiService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.formData.images = `${environment.imageUrl}${res.data}`;
            this.finalizeSubmit();
          } else {
            this.error = 'Failed to upload image';
            this.loading = false;
          }
        },
        error: (err: any) => {
          this.error = 'Image upload failed: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    } else {
      this.finalizeSubmit();
    }
  }

  finalizeSubmit() {
    // Transform comma separated strings to arrays
    const payload = {
      ...this.formData,
      amenities: this.formData.amenities ? this.formData.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
      images: this.formData.images ? this.formData.images.split(',').map(i => i.trim()).filter(i => i) : []
    };

    if (payload.images.length === 0) {
      payload.images = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80']; // default fallback
    }

    this.apiService.createProperty(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.propertyAdded.emit(res.data);
          this.close.emit();
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add property';
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
