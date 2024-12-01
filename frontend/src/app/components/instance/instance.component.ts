import { Component, ViewChild, ElementRef } from "@angular/core";
import { Form, formDetailed } from "src/app/models/form";
import { Router } from "@angular/router";
import { Instance, InstanceWithFormDetailed } from "src/app/models/instance";
import { InstanceService } from "src/app/services/instance.service";
import { Question } from "src/app/models/question";
import { Answer } from "src/app/models/answer";

@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        './instance.component.css'
    ]
})
export class InstanceComponent {
    form: Form;
    submit: boolean = false;
    instance: InstanceWithFormDetailed = null!;
    questions: Question[] = [];
    questionNumber: number = 0;

    
    constructor(private router: Router, private instanceService: InstanceService){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
    }

    ngOnInit() {
        this.instanceService.getInstance(this.form?.lastInstance.instanceId).subscribe((res) => {
            this.instance = res;
            if(this.instance.form) {
                this.questions = this.instance.form.questions;
                
            }

         
            console.log(res);
        })
    }

    arrowBack() {
        this.router.navigate(['/forms']);
    }
    
    incrementQuestion() {
        if ( this.questions && this.questionNumber < this.questions.length - 1)
            ++this.questionNumber;
        
    }

    decrementQuestion() {
        if (this.questionNumber > 0)
            --this.questionNumber;
        
    }
  
      
}