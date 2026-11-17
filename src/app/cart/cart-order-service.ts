 
import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
  readonly icon: string;
}
export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}
export type OrderStatus = 'placed' | 'shipped' | 'delivered';
export interface Order {
  readonly id: string;
  readonly items: readonly CartItem[];
  readonly total: number;
  readonly paymentId: string;
  readonly status: OrderStatus;
}
export interface PaymentRequest {
  readonly amountInCents: number;
  readonly currency: 'USD';
  readonly mode: 'test';
}
export interface PaymentReceipt {
  readonly paymentId: string;
}
export interface PaymentGateway {
  charge(request: PaymentRequest): Promise<PaymentReceipt>;
}
@Injectable({ providedIn: 'root' })
export class TestModePaymentGateway implements PaymentGateway {
  private nextPaymentId = 1;
  async charge(request: PaymentRequest): Promise<PaymentReceipt> {
    if (request.mode !== 'test') {
      throw new Error('The demo payment gateway only supports test mode.');
    }
    return { paymentId: `test-payment-${this.nextPaymentId++}` };
  }
}
export const PAYMENT_GATEWAY = new InjectionToken<PaymentGateway>('PAYMENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(TestModePaymentGateway),
});
@Injectable({ providedIn: 'root' })
export class CartOrderService {
  readonly inventory = signal<Product[]>([
    { id: 'notebook', name: 'Field Notebook', price: 12.5, stock: 8, icon: 'menu_book' },
    { id: 'pen', name: 'Precision Pen', price: 4.25, stock: 12, icon: 'edit' },
    { id: 'bag', name: 'Everyday Bag', price: 48, stock: 4, icon: 'shopping_bag' },
  ]);
  readonly cart = signal<CartItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly itemCount = computed(() =>
    this.cart().reduce((count, item) => count + item.quantity, 0),
  );
  readonly cartTotal = computed(() =>
    this.cart().reduce((total, item) => total + item.price * item.quantity, 0),
  );
  private readonly paymentGateway = inject(PAYMENT_GATEWAY);
  private checkoutPending = false;
  private nextOrderId = 1;
  addToCart(productId: string): void {
    this.assertCartCanChange();
    const product = this.findProduct(productId);
    const existing = this.cart().find((item) => item.productId === productId);
    const quantity = (existing?.quantity ?? 0) + 1;
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} ${product.name} available.`);
    }
    if (existing) {
      this.cart.update((items) =>
        items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    } else {
      this.cart.update((items) => [
        ...items,
        { productId, name: product.name, price: product.price, quantity },
      ]);
    }
  }
  updateQuantity(productId: string, quantity: number): void {
    this.assertCartCanChange();
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new RangeError('Quantity must be a non-negative whole number.');
    }
    if (quantity === 0) {
      this.removeFromCart(productId);
      return;
    }
    const product = this.findProduct(productId);
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} ${product.name} available.`);
    }
    if (!this.cart().some((item) => item.productId === productId)) {
      throw new Error(`Product ${productId} is not in the cart.`);
    }
    this.cart.update((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }
  removeFromCart(productId: string): void {
    this.assertCartCanChange();
    this.cart.update((items) => items.filter((item) => item.productId !== productId));
  }
  async placeOrder(): Promise<Order> {
    this.assertCartCanChange();
    const items = this.cart().map((item) => ({ ...item }));
    if (items.length === 0) {
      throw new Error('Add an item to the cart before placing an order.');
    }
    for (const item of items) {
      const product = this.findProduct(item.productId);
      if (item.quantity > product.stock) {
        throw new Error(`Only ${product.stock} ${product.name} available.`);
      }
    }
    this.checkoutPending = true;
    this.inventory.update((products) =>
      products.map((product) => {
        const item = items.find((cartItem) => cartItem.productId === product.id);
        return item ? { ...product, stock: product.stock - item.quantity } : product;
      }),
    );
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const receipt = await this.paymentGateway.charge({
        amountInCents: Math.round(total * 100),
        currency: 'USD',
        mode: 'test',
      });
      const order: Order = {
        id: `order-${this.nextOrderId++}`,
        items,
        total,
        paymentId: receipt.paymentId,
        status: 'placed',
      };
      this.orders.update((orders) => [...orders, order]);
      this.cart.set([]);
      return order;
    } catch (error) {
      this.inventory.update((products) =>
        products.map((product) => {
          const item = items.find((cartItem) => cartItem.productId === product.id);
          return item ? { ...product, stock: product.stock + item.quantity } : product;
        }),
      );
      throw error;
    } finally {
      this.checkoutPending = false;
    }
  }
  advanceOrder(orderId: string): void {
    const order = this.orders().find((current) => current.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} was not found.`);
    }
    if (order.status === 'delivered') {
      throw new Error('A delivered order cannot advance to another status.');
    }
    const status: OrderStatus = order.status === 'placed' ? 'shipped' : 'delivered';
    this.orders.update((orders) =>
      orders.map((current) => (current.id === orderId ? { ...current, status } : current)),
    );
  }
  private findProduct(productId: string): Product {
    const product = this.inventory().find((item) => item.id === productId);
    if (!product) {
      throw new Error(`Product ${productId} was not found.`);
    }
    return product;
  }
  private assertCartCanChange(): void {
    if (this.checkoutPending) {
      throw new Error('The cart cannot change while payment is processing.');
    }
  }
}
 