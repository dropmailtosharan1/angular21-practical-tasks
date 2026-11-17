import { ChangeDetectionStrategy, Component } from '@angular/core';
 
@Component({
  selector: 'app-angular-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 4 5 20l7 62 38 21 38-21 7-62L50 4Zm0 15 26 57H63l-5-12H42l-5 12H24l26-57Zm0 23-5 12h10l-5-12Z"
      />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: var(--logo-size, 32px);
      height: var(--logo-size, 32px);
    }
 
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
})
export class AngularLogo {}
 