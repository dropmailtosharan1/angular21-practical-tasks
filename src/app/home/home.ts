import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularLogo } from '../shared/angular-logo';
 
@Component({
  selector: 'app-home',
  imports: [RouterLink, AngularLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
