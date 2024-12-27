import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { plainToClass, plainToInstance } from "class-transformer";

import { Form } from "src/app/models/form";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FormService } from "src/app/services/form.service";


export class MyErrorStateMatcher implements ErrorStateMatcher{
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || 
            control.touched || isSubmitted
        ));
    }
}

@Component({
    selector: 'add-edit-form',
    templateUrl:'add-edit-form.component.html',
    styleUrls: [
        'add-edit-form.component.css'
    ]

})
export class AddEditFormComponent implements OnInit{
    public frm!: FormGroup  
  
    public matcher = new MyErrorStateMatcher();

    
    public form: Form;
    public isNew: boolean;
    public owner?: User;



    constructor(private fb: FormBuilder,
                private router: Router,
                private authenticationService: AuthenticationService,
                private formService: FormService
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.isNew = navigation?.extras.state?.['isNew'];
        console.log('Form object:', this.form);
      
        
      
       
    }

    ngOnInit(): void {
        this.owner = this.isNew ? this.authenticationService?.currentUser  : this.form?.owner; 
      /*  this.titleCtl = this.fb.control('', [Validators.required]);
        this.descriptionCtl = this.fb.control('', [Validators.minLength(3)]);
      
    
        this.publicCtl = this.fb.control('');*/
        this.frm = this.fb.group({
            title: [this.form?.title || '', [Validators.required]],
            description: [this.form?.description || '', [Validators.minLength(3)]],
            isPublic: [this.form?.isPublic || false]
        });
        this.frm.patchValue(this.form);
       
    
        console.log(this.frm);
    } 

    saveForm() {
       // var data = plainToInstance(Form, this.frm.value);
        if ( this.isNew && this.owner) {

            this.form.owner = this.owner;
            this.form.ownerId = this.owner.id;
        }
       /* this.form.title = this.titleCtl.value;
        this.form.isPublic  = this.publicCtl.value;
        this.form.description = this.descriptionCtl.value;*/
        Object.assign(this.form, this.frm.value);


        console.log("data: ", this.form);
        this.formService.postForm(this.form).subscribe(res => this.router.navigate(['view_forms']));
    }
  
    


}