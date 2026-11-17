import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { routes } from './app.routes';
 
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter(routes)],
    }).compileComponents();
  });
 
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
 
  it('renders the header links and footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header')?.textContent ?? '';
    for (const label of ['Material', 'Components', 'CDK', 'Guides', 'GitHub']) {
      expect(header).toContain(label);
    }
    expect(compiled.querySelector('footer')?.textContent).toContain('Learn Angular');
  });
 
  it('renders the home hero at the root route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const home = harness.routeNativeElement as HTMLElement;
    expect(home.querySelector('h1')?.textContent).toContain('Angular Material');
    expect(home.querySelector('.get-started')).not.toBeNull();
  });
 
  it('renders navigation links for each example under /components', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/components');
    const layout = harness.routeNativeElement as HTMLElement;
    const links = Array.from(layout.querySelectorAll('mat-nav-list a'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/components/stocks',
      '/components/registration',
      '/components/faq',
      '/components/cart',
      '/components/weather',
      '/components/angular-mcp-audit',
    ]);
  });
});
 