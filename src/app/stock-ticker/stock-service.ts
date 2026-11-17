import { Injectable } from '@angular/core';
import { Observable, filter, interval, map } from 'rxjs';
 
export interface Stock {
  symbol: string;
  name: string;
  price: number;
}
 
export interface StockUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}
 
@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly prices = new Map<string, number>();
 
  /** Native async/await fetch from the mock API (static JSON served from /public). */
  async fetchSnapshot(): Promise<Stock[]> {
    const response = await fetch('mock-api/stocks.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Mock API responded with ${response.status}`);
    }
    const stocks = (await response.json()) as Stock[];
    this.prices.clear();
    stocks.forEach((s) => this.prices.set(s.symbol, s.price));
    return stocks;
  }
 
  /** Emits a random price update every 500ms; emits nothing until a snapshot is loaded. */
  readonly updates$: Observable<StockUpdate> = interval(500).pipe(
    map(() => this.nextUpdate()),
    filter((update): update is StockUpdate => update !== null),
  );
 
  private nextUpdate(): StockUpdate | null {
    const symbols = [...this.prices.keys()];
    if (symbols.length === 0) {
      return null;
    }
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const current = this.prices.get(symbol)!;
    const changePct = (Math.random() - 0.5) * 0.02;
    const price = Math.round(current * (1 + changePct) * 100) / 100;
    this.prices.set(symbol, price);
    return { symbol, price, timestamp: Date.now() };
  }
}
 