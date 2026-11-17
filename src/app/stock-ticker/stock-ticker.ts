import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Stock, StockService } from './stock-service';
 
interface StockRow extends Stock {
  previous: number;
}
 
type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
 
@Component({
  selector: 'app-stock-ticker',
  imports: [
    DatePipe,
    DecimalPipe,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stock-ticker.html',
  styleUrl: './stock-ticker.scss',
})
export class StockTicker {
  private readonly stockService = inject(StockService);
  private readonly destroyRef = inject(DestroyRef);
 
  protected readonly columns = ['symbol', 'name', 'price', 'change'];
  protected readonly rows = signal<StockRow[]>([]);
  protected readonly status = signal<LoadStatus>('idle');
  protected readonly updateCount = signal(0);
  protected readonly lastUpdated = signal<number | null>(null);
  protected readonly lastLoaded = signal<number | null>(null);
  protected readonly hasData = computed(() => this.rows().length > 0);
 
  constructor() {
    // Timers and fetch only run in the browser, never during SSR/prerender.
    afterNextRender(() => {
      this.stockService.updates$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ symbol, price, timestamp }) => {
          this.rows.update((rows) =>
            rows.map((r) => (r.symbol === symbol ? { ...r, previous: r.price, price } : r)),
          );
          this.updateCount.update((n) => n + 1);
          this.lastUpdated.set(timestamp);
        });
 
      void this.loadSnapshot();
    });
  }
 
  /** Plain async/await: signal writes after `await` schedule a render with no Zone.js and no detectChanges(). */
  protected async loadSnapshot(): Promise<void> {
    this.status.set('loading');
    try {
      const stocks = await this.stockService.fetchSnapshot();
      this.rows.set(stocks.map((s) => ({ ...s, previous: s.price })));
      this.lastLoaded.set(Date.now());
      this.status.set('loaded');
    } catch {
      this.status.set('error');
    }
  }
 
  protected direction(row: StockRow): 'up' | 'down' | 'flat' {
    return row.price > row.previous ? 'up' : row.price < row.previous ? 'down' : 'flat';
  }
}
 