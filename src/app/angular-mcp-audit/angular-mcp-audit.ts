import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
 
@Component({
  selector: 'app-angular-mcp-audit',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './angular-mcp-audit.html',
  styleUrl: './angular-mcp-audit.scss',
})
export class AngularMcpAudit {}
 