import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShoppingCart } from './shopping-cart';
import { CartOrderService, PAYMENT_GATEWAY, PaymentGateway } from './cart-order-service';
 
describe('ShoppingCart (zoneless)', () => {
  let gateway: PaymentGateway;
 
  beforeEach(async () => {
    gateway = {
      charge: vi.fn<PaymentGateway['charge']>().mockResolvedValue({
        paymentId: 'test-payment-42',
      }),
    };
    await TestBed.configureTestingModule({
      imports: [ShoppingCart],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PAYMENT_GATEWAY, useValue: gateway },
      ],
    }).compileComponents();
  });
 
  it('adds, updates, and removes quantities through the rendered controls', async () => {
    const fixture = TestBed.createComponent(ShoppingCart);
    const service = TestBed.inject(CartOrderService);
    const addSpy = vi.spyOn(service, 'addToCart');
    fixture.detectChanges();
 
    expect(fixture.nativeElement.querySelector('.empty')?.textContent).toContain(
      'Your cart is empty.',
    );
    (
      fixture.nativeElement.querySelector('[data-testid="add-notebook"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(addSpy).toHaveBeenCalledWith('notebook');
    expect(service.itemCount()).toBe(1);
    expect(fixture.nativeElement.querySelector('.cart-item h4')?.textContent).toContain(
      'Field Notebook',
    );
 
    (
      fixture.nativeElement.querySelector(
        '[aria-label="Increase Field Notebook quantity"]',
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(service.itemCount()).toBe(2);
    expect(fixture.nativeElement.querySelector('.cart-count')?.textContent).toContain('2 items');
 
    (
      fixture.nativeElement.querySelector('[aria-label="Remove Field Notebook"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(service.cart()).toEqual([]);
  });
 
  it('deducts stock after test payment and allows the order status lifecycle', async () => {
    const fixture = TestBed.createComponent(ShoppingCart);
    const service = TestBed.inject(CartOrderService);
    fixture.detectChanges();
    service.addToCart('notebook');
 
    await fixture.componentInstance.placeOrder();
    expect(gateway.charge).toHaveBeenCalledWith({
      amountInCents: 1250,
      currency: 'USD',
      mode: 'test',
    });
    expect(service.inventory().find((product) => product.id === 'notebook')?.stock).toBe(7);
    expect(service.cart()).toEqual([]);
    expect(service.orders()[0]?.status).toBe('placed');
 
    service.advanceOrder(service.orders()[0]!.id);
    expect(service.orders()[0]?.status).toBe('shipped');
    service.advanceOrder(service.orders()[0]!.id);
    expect(service.orders()[0]?.status).toBe('delivered');
  });
 
  it('restores stock and keeps the cart when test payment fails', async () => {
    gateway.charge = vi.fn().mockRejectedValue(new Error('Payment was declined.'));
    const fixture = TestBed.createComponent(ShoppingCart);
    const service = TestBed.inject(CartOrderService);
    fixture.detectChanges();
    service.addToCart('notebook');
 
    await fixture.componentInstance.placeOrder();
    await fixture.whenStable();
 
    expect(service.inventory().find((product) => product.id === 'notebook')?.stock).toBe(8);
    expect(service.itemCount()).toBe(1);
    expect(service.orders()).toEqual([]);
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Payment was declined.',
    );
  });
});
 