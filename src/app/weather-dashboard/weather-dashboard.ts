import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { WeatherData, WEATHER_ENDPOINT } from './weather-api';
 
@Component({
  selector: 'app-weather-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.scss',
})
export class WeatherDashboard {
  protected readonly city = signal('New York');
  protected readonly cities = ['New York', 'London', 'Tokyo', 'Hyderabad', 'Offline'];
  protected readonly weather = httpResource<WeatherData>(() => ({
    url: WEATHER_ENDPOINT,
    params: { city: this.city() },
    cache: 'no-store',
    transferCache: false,
  }));
}
 