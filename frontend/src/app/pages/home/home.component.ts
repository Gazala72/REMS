import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { LucideAngularModule, Search, MapPin, Home } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyCardComponent, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  apiService = inject(ApiService);
  router = inject(Router);

  properties: any[] = [];
  loading = true;

  keyword = '';
  location = '';
  type = '';

  readonly SearchIcon = Search;
  readonly MapPinIcon = MapPin;
  readonly HomeIcon = Home;

  ngOnInit() {
    this.apiService.getProperties({ limit: 6 }).subscribe({
      next: (res) => {
        if (res.success) {
          this.properties = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.router.navigate(['/properties'], {
      queryParams: { keyword: this.keyword, location: this.location, type: this.type }
    });
  }
}
