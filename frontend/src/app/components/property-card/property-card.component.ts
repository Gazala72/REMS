import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, MapPin, Bed, Bath, Square } from 'lucide-angular';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() property: any;

  readonly MapPinIcon = MapPin;
  readonly BedIcon = Bed;
  readonly BathIcon = Bath;
  readonly SquareIcon = Square;
}
