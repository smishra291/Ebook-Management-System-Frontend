import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      alert('Please fill in all fields');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<{ id: number; name: string; email: string }>(`${this.apiUrl}/login`, { email, password })
      .subscribe(
        (response) => {
          console.log('Login successful:', response);

          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(response));

          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Login failed: ' + (error.error?.error || 'Unknown error'));
        }
      );
  }
}