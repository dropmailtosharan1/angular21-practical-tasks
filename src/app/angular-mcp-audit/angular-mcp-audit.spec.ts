import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMcpAudit } from './angular-mcp-audit';

describe('AngularMcpAudit', () => {
  let component: AngularMcpAudit;
  let fixture: ComponentFixture<AngularMcpAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMcpAudit],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularMcpAudit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
