import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common'; // Add this import
import { ReactiveFormsModule } from '@angular/forms'; // Add this import

@Component({
  selector: 'app-register',
  standalone: true, // Ensure standalone is true
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Add CommonModule and ReactiveFormsModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  formularioRegistro: FormGroup;
  userService = inject(UserService);

  constructor(
    private form: FormBuilder,
    private router: Router,
  ) {
    this.formularioRegistro = this.form.group({
      name: ['', [Validators.required]], // Username field
      email: ['', [Validators.required, Validators.email]], // Email field
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]], // Age field
    });
  }

  // Helper method to check for form control errors
  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioRegistro.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }

  // Handle form submission
  register() {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const credentials = this.formularioRegistro.value;
    this.userService.registerUser(credentials).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/login']); // Redirect to login after successful registration
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      },
    });
  }
}