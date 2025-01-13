import { Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from "src/app/services/authentication.service";
import { th, tr } from "date-fns/locale";
import { state } from "@angular/animations";

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']

})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    ctlEmail!: FormControl;
    ctlPassword!: FormControl;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/view_forms']);
        }

    }


    ngOnInit() {
        this.ctlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
        this.ctlPassword = this.formBuilder.control('', [Validators.required, Validators.maxLength(10), Validators.minLength(3)]);
        this.loginForm = this .formBuilder.group({
           email: this.ctlEmail,
           password: this.ctlPassword
           
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/view_forms';
    }
   /* ngAfterViewInit(): void {
        setTimeout(() => this.email && this.email.nativeElement.focus());
        
    }*/

    get f() { return this.loginForm.controls;}

    loginAs(email: string ,password: string) {
       /* this.submitted = true;
        this.loading = true;
        this.login(email, password);*/
        this.ctlPassword.setValue(password);
        this.ctlEmail.setValue(email);
    }

    loginAsGuest() {
        this.submitted = true;
        
        
       this.authenticationService.loginAsGuest();
       this.router.navigate(['/view_forms']);
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) return;
        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .subscribe({
                next: data => {
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    const errors = error.error.errors;
                    for (let err of errors) {
                        this.loginForm.get(err.propertyName.toLowerCase())?.setErrors({ custom: err.errorMessage })
                    }
                    this.loading = false;
                }
            })
    }
    login(email: string, password: string) {
        this.authenticationService.login(email, password)
            .subscribe({
                next: data => {
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    /*console.log(error);
                     this.error = error.error.errors[0].errorMessage;*/
                    const errors = error.error.errors;
                    for (let err of errors) {
                        this.loginForm.get(err.propertyName.toLowerCase())?.setErrors({ custom: err.errorMessage })
                    }
                    this.loading = false;
                }
            })
    }
}