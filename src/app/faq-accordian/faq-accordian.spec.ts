import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAccordian } from './faq-accordian';

describe('FaqAccordian', () => {
  let component: FaqAccordian;
  let fixture: ComponentFixture<FaqAccordian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqAccordian],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqAccordian);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
