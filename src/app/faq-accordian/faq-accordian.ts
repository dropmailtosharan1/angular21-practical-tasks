import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
 
/** A single frequently-asked-question entry rendered inside the accordion. */
interface FaqItem {
  readonly id: string;
  readonly icon: string;
  readonly question: string;
  readonly answer: string;
}
 
/**
 * A fully custom, corporate-styled FAQ / Accordion component built on top of the
 * headless `@angular/cdk/accordion` primitives.
 *
 * The CDK manages expansion state (including single vs. multi expansion); the
 * template wires `aria-expanded`, `aria-controls` and `aria-labelledby`, and
 * the triggers are native buttons, so Tab, Enter and Space work out of the box.
 */
@Component({
  selector: 'app-faq-accordian',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkAccordion, CdkAccordionItem, MatIcon, MatRipple],
  templateUrl: './faq-accordian.html',
  styleUrl: './faq-accordian.scss',
})
export class FaqAccordian {
  /** When true, more than one panel may stay open at the same time. */
  protected readonly multiExpandable = signal(false);
 
  /** The FAQ content rendered by the accordion. */
  protected readonly faqs = signal<readonly FaqItem[]>([
    {
      id: 'faq-onboarding',
      icon: 'rocket_launch',
      question: 'How do I get started with the corporate platform?',
      answer:
        'Sign in with your single sign-on credentials, complete the guided ' +
        'onboarding checklist, and your workspace will be provisioned ' +
        'automatically within a few minutes.',
    },
    {
      id: 'faq-security',
      icon: 'security',
      question: 'How is my data secured?',
      answer:
        'All data is encrypted in transit with TLS 1.3 and at rest with ' +
        'AES-256. Access is governed by role-based permissions and audited ' +
        'continuously by our security operations team.',
    },
    {
      id: 'faq-billing',
      icon: 'receipt_long',
      question: 'Where can I review billing and invoices?',
      answer:
        'Navigate to Settings → Billing to download invoices, manage payment ' +
        'methods, and view your current subscription tier and usage.',
    },
    {
      id: 'faq-support',
      icon: 'support_agent',
      question: 'How do I contact enterprise support?',
      answer:
        'Enterprise customers have access to 24/7 priority support via the ' +
        'in-app help widget, a dedicated account manager, and a guaranteed ' +
        'one-hour response SLA for critical incidents.',
    },
  ]);
}
 