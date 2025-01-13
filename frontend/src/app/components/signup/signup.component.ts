import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['../login/login.component.css']
})
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/view_forms']);
        }
    }

    ngOnInit() {
        this.signupForm = this.formBuilder.group({
            email: ['', [Validators.required, this.emailValidator]],
            password: ['', [Validators.required, this.passwordValidator]],
            confirmPassword: ['', [Validators.required, this.passwordValidator]],
            firstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
            lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
            birthDate: ['', [Validators.required, this.ageValidator]]
        }, {
            //validator: this.nameValidator(this.signupForm?.get('firstName')!, this.signupForm?.get('lastName')!)
        });

        this.returnUrl = '/view_forms';
    }

    get f() { return this.signupForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.signupForm.invalid) return;
        this.loading = true;
        this.authenticationService.signup(this.f.email.value, this.f.password.value, this.f.firstName.value, this.f.lastName.value, this.f.birthDate.value)
            .subscribe({
                next: () => {
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    const errors = error.error.errors;
                    for (let err of errors) {
                        this.signupForm.get(err.propertyName.toLowerCase())?.setErrors({ custom: err.errorMessage });
                    }
                    this.loading = false;
                }
            });
    }

    // Validator for email
    emailValidator(control: AbstractControl): ValidationErrors | null {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(control.value) ? null : { invalidEmail: 'Invalid email format' };
    }

    // Validator for password length
    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const minLength = 3;
        const maxLength = 10;
        return control.value && control.value.length >= minLength && control.value.length <= maxLength
            ? null
            : { invalidPassword: 'Password must be between 3 and 10 characters' };
    }

    // Validator for unique and valid first and last names
    nameValidator(firstNameControl: AbstractControl, lastNameControl: AbstractControl) {
        return (control: AbstractControl): ValidationErrors | null => {
            const firstName = firstNameControl.value?.trim();
            const lastName = lastNameControl.value?.trim();
            if (firstName && lastName && (firstName.length < 3 || firstName.length > 50 || lastName.length < 3 || lastName.length > 50)) {
                return { invalidName: 'First and last names must be between 3 and 50 characters' };
            }
            if ((firstName && lastName) && (firstName.startsWith(' ') || lastName.startsWith(' ') || firstName.endsWith(' ') || lastName.endsWith(' '))) {
                return { invalidName: 'Names cannot start or end with whitespace' };
            }
            return null;
        };
    }

    // Validator for age range
    ageValidator(control: AbstractControl): ValidationErrors | null {
        const birthDate = new Date(control.value);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return (age >= 18 && age <= 125) ? null : { invalidAge: 'Age must be between 18 and 125' };
    }
}

