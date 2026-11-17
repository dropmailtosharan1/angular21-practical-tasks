import { Routes } from '@angular/router';
 
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((module) => module.Home),
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./components-layout/components-layout').then((module) => module.ComponentsLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'stocks' },
      {
        path: 'stocks',
        loadComponent: () =>
          import('./stock-ticker/stock-ticker').then((module) => module.StockTicker),
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./user-registration/user-registration').then(
            (module) => module.UserRegistration,
          ),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./faq-accordian/faq-accordian').then((module) => module.FaqAccordian),
      },
      {
        path: 'cart',
        loadComponent: () => import('./cart/shopping-cart').then((module) => module.ShoppingCart),
      },
      {
        path: 'weather',
        loadComponent: () =>
          import('./weather-dashboard/weather-dashboard').then((module) => module.WeatherDashboard),
      },
      {
        path: 'angular-mcp-audit',
        loadComponent: () =>
          import('./angular-mcp-audit/angular-mcp-audit').then(
            (module) => module.AngularMcpAudit,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
 