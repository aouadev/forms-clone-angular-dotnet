import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }


    ngOnInit() {
        this.loginForm = this .formBuilder.group({
           email: ['', Validators.required] 
           
        });
    }
    ngAfterViewInit(): void {
        
    }

    onSubmit() {
        
    }
}