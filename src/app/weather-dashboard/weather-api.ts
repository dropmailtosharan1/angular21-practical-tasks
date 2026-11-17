import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map, timer } from 'rxjs';
 
export interface WeatherData {
  city: string;
  temperatureC: number;
  humidity: number;
  windKph: number;
  condition: string;
  updatedAt: string;
}
 
export const WEATHER_ENDPOINT = '/api/mock-weather';
 
export const mockWeatherInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.method !== 'GET' || request.url !== WEATHER_ENDPOINT) {
    return next(request);
  }
 
  return timer(800).pipe(
    map(() => {
      const city = request.params.get('city');
      if (!city || city === 'Offline') {
        throw new HttpErrorResponse({
          status: city ? 503 : 400,
          statusText: city ? 'Service Unavailable' : 'Bad Request',
          url: request.urlWithParams,
          error: { message: city ? 'Mock weather service is offline. Try another city.' : 'City is required.' },
        });
      }
 
      const conditions = ['Sunny', 'Cloudy', 'Light rain'];
      const body: WeatherData = {
        city,
        temperatureC: Math.round((10 + Math.random() * 20) * 10) / 10,
        humidity: Math.floor(30 + Math.random() * 60),
        windKph: Math.round(Math.random() * 30),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        updatedAt: new Date().toISOString(),
      };
 
      return new HttpResponse({
        body,
        headers: new HttpHeaders({ 'Cache-Control': 'no-store' }),
        url: request.urlWithParams,
      });
    }),
  );
};
 