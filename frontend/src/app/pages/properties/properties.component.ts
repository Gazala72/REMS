import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { LucideAngularModule, Filter } from 'lucide-angular';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyCardComponent, LucideAngularModule],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  properties: any[] = [];
  loading = true;

  filters: any = {
    keyword: '',
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sort: 'recent'
  };

  readonly FilterIcon = Filter;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filters.keyword = params['keyword'] || '';
      this.filters.location = params['location'] || '';
      this.filters.type = params['type'] || '';
      this.fetchProperties();
    });
  }

  fetchProperties() {
    this.loading = true;

    const queryParams: any = {
      keyword: this.filters.keyword,
      location: this.filters.location,
      type: this.filters.type,
      minPrice: this.filters.minPrice,
      maxPrice: this.filters.maxPrice,
      bedrooms: this.filters.bedrooms,
    };

    if (this.filters.sort === 'price_asc') queryParams.sort = 'price_asc';
    else if (this.filters.sort === 'price_desc') queryParams.sort = 'price_desc';

    this.apiService.getProperties(queryParams).subscribe({
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

  applyFilters(e: Event) {
    e.preventDefault();
    this.fetchProperties();
  }
}
