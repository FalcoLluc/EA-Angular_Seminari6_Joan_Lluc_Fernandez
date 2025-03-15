import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {
  date: Date = new Date('2025-08-14');
  Prova: string = 'Este texto deberia estar en mayusculas';
  formularioLogin: FormGroup;
  authService = inject(AuthService);

  constructor(private form: FormBuilder, private router: Router) {
    this.formularioLogin = this.form.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]], // Default value for testing
      password: ['cityslicka', [Validators.required, Validators.minLength(8)]], // Default value for testing
    });
  }

  hasError(controlName:string, errorType:string){
    return this.formularioLogin.get(controlName)?.hasError(errorType) && this.formularioLogin.get(controlName)?.touched;  
  }

  login() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const loginData = this.formularioLogin.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/usuario']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        if (error.status === 401) {
          alert('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else {
          alert('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
      },
    });
  }
}