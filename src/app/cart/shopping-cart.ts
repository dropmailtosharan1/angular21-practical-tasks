import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CartOrderService } from './cart-order-service';
 
@Component({
  selector: 'app-shopping-cart',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  private readonly cartService = inject(CartOrderService);
 
  readonly products = this.cartService.inventory;
  readonly cart = this.cartService.cart;
  readonly orders = this.cartService.orders;
  readonly itemCount = this.cartService.itemCount;
  readonly cartTotal = this.cartService.cartTotal;
  readonly errorMessage = signal('');
  readonly notice = signal('');
 
  add(productId: string): void {
    this.run(() => this.cartService.addToCart(productId));
  }
 
  changeQuantity(productId: string, quantity: number): void {
    this.run(() => this.cartService.updateQuantity(productId, quantity));
  }
 
  remove(productId: string): void {
    this.run(() => this.cartService.removeFromCart(productId));
  }
 
  async placeOrder(): Promise<void> {
    this.errorMessage.set('');
    this.notice.set('');
    try {
      const order = await this.cartService.placeOrder();
      this.notice.set(`Order ${order.id} placed. Test payment ${order.paymentId} approved.`);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : String(error));
    }
  }
 
  advanceOrder(orderId: string): void {
    this.run(() => this.cartService.advanceOrder(orderId));
  }
 
  private run(action: () => void): void {
    this.errorMessage.set('');
    this.notice.set('');
    try {
      action();
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : String(error));
    }
  }
}
 