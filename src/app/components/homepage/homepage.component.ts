import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomepageComponent {
  form: FormGroup;
  signupform: FormGroup;
  hide: boolean = true;
  showSignup: boolean = false;
  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
      
      this.form = this.fb.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
      });

      this.signupform = this.fb.group({
        email: ['',Validators.required],
        name: ['',Validators.required],
        password: ['',Validators.required]
      })
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

    signup() {
      const val = this.signupform.value;

      if (val.email && val.password && val.name) {
        // create auth service for signup and then subscribe to it...
        console.log("Signing up!")
      }
      
    }
}
