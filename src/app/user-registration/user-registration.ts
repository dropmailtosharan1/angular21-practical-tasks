import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
 
export interface UserModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
 
const TAKEN_USERNAMES = new Set(['admin', 'root', 'john', 'user']);
 
/** Async validator: rejects usernames that are already taken. */
function usernameTakenValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = (control.value ?? '').toString().toLowerCase();
    if (value.length < 3) {
      return of(null);
    }
    return of(TAKEN_USERNAMES.has(value)).pipe(
      delay(600),
      map((taken) => (taken ? { userExists: 'Username already exists' } : null)),
    );
  };
}
 
/** Cross-field validator: confirmPassword must match password. */
function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: 'Passwords do not match' };
  };
}
 
/** Cross-field validator: password must not contain the username. */
function passwordContainsUsernameValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const username = (group.get('username')?.value ?? '').toString().toLowerCase();
    const password = (group.get('password')?.value ?? '').toString().toLowerCase();
    return username && password.includes(username)
      ? { containsUsername: 'Password must not contain the username' }
      : null;
  };
}
 
@Component({
  selector: 'app-user-registration',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistration {
  private readonly fb = inject(FormBuilder);
 
  readonly registrationForm = this.fb.group(
    {
      username: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
          asyncValidators: [usernameTakenValidator()],
        },
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(32)],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator(), passwordContainsUsernameValidator()],
    },
  );
 
  readonly submitted = signal<UserModel | null>(null);
 
  get canSubmit(): boolean {
    return this.registrationForm.valid && !this.registrationForm.pending;
  }
 
  onSubmit(formDir: FormGroupDirective): void {
    if (!this.canSubmit) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    const user = this.registrationForm.getRawValue() as UserModel;
    console.log('Registered user details:', user);
    // Remember this username so registering it again shows "already exists".
    TAKEN_USERNAMES.add(user.username.toLowerCase());
    this.submitted.set(user);
    // Reset the directive (not just the FormGroup) so Material clears the
    // "submitted" state and no validation errors are shown afterwards.
    formDir.resetForm();
  }
}
 