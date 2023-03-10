import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  form: FormGroup;
  hide: boolean = true;
  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
      
      this.form = this.fb.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
      });
    }
    
    login() {
      const val = this.form.value;

      if (val.email && val.password) {
          this.authService.login(val.email, val.password)
              .subscribe((val) => {
                if (val.idToken) {
                  this.router.navigateByUrl('/expenselist');
                }
              });
        }
    }
}
