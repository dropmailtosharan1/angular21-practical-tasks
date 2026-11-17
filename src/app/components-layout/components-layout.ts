import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
 
@Component({
  selector: 'app-components-layout',
  imports: [MatIconModule, MatListModule, MatSidenavModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-layout.html',
  styleUrl: './components-layout.scss',
})
export class ComponentsLayout {
  protected readonly navigationItems = [
    { path: '/components/stocks', label: 'Stock Ticker', icon: 'show_chart' },
    { path: '/components/registration', label: 'User Registration', icon: 'person_add' },
    { path: '/components/faq', label: 'FAQ Accordion', icon: 'help_outline' },
    { path: '/components/cart', label: 'Shopping Cart', icon: 'shopping_cart' },
    { path: '/components/weather', label: 'Weather Dashboard', icon: 'cloud' },
    { path: '/components/angular-mcp-audit', label: 'Angular MCP Audit', icon: 'integration_instructions' },
  ];
}
 