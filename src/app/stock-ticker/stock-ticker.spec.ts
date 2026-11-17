import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { StockTicker } from './stock-ticker';
import { Stock, StockService, StockUpdate } from './stock-service';
 
describe('StockTicker (zoneless)', () => {
  const stocks: Stock[] = [{ symbol: 'AAPL', name: 'Apple Inc.', price: 100 }];
  let updates$: Subject<StockUpdate>;
 
  beforeEach(async () => {
    updates$ = new Subject<StockUpdate>();
    await TestBed.configureTestingModule({
      imports: [StockTicker],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: StockService,
          useValue: { updates$, fetchSnapshot: () => Promise.resolve(stocks) },
        },
      ],
    }).compileComponents();
  });
 
  it('renders data after the async fetch resolves without detectChanges()', async () => {
    const fixture = TestBed.createComponent(StockTicker);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.symbol')?.textContent).toContain('AAPL');
  });
 
  it('updates the view when the stream pushes a new price', async () => {
    const fixture = TestBed.createComponent(StockTicker);
    await fixture.whenStable();
 
    updates$.next({ symbol: 'AAPL', price: 105.5, timestamp: Date.now() });
    await fixture.whenStable();
 
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.num.up')?.textContent).toContain('105.50');
    expect(el.querySelector('.num.up')?.classList).toContain('up');
  });
});
 