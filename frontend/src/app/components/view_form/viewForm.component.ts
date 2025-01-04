import { InputModalityDetector } from "@angular/cdk/a11y";
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { Form} from "src/app/models/form";
import { FormService } from "src/app/services/form.service";
import { Question } from "src/app/models/question";
import { template } from "lodash-es";

import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { WarningDialog } from "./dialogs/warningDialog.component";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PublicDialog } from "./dialogs/publicDialog.component";
import { th } from "date-fns/locale";
import { DeleteFormDialog } from "./dialogs/deleteFormDialog.component";
import { DataService } from "src/app/services/data.service";

@Component({
    selector: "view-form",
    templateUrl: "viewForm.component.html",
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        "../instance/instance.component.css",
        "./viewForm.component.css"
    ]
})
export class ViewFormComponent implements OnInit{

    form: Form;
    owner?: User;
    isInstancied: boolean = false;
    currentUser?: User;
    toggleState: boolean = false;
    

    constructor(private router: Router,
                private formService: FormService,
                private dataService: DataService,
                private dialog: MatDialog,
                private authenticationService: AuthenticationService,
                

    ) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras?.state?.['data'];
        //console.log('Form Object: ', this.form);
        //this.isInstancied = this.form.lastInstance != null;
        this.currentUser = this.authenticationService.currentUser;
      
       
        //this.owner = navigation?.extras?.state?.['form.owner'];
        
    }

    arrowBack() {
        this.router.navigate(['/view_forms']);
    }

    ngOnInit(): void {
        if (this.form){
            this.formService.getForm(this.form.formId).subscribe(res =>{
                //console.log('API Response:', res); // Vérifiez ici si `owner` est présent
                this.form = res;
                this.form.ownerFullName = `${this.form.owner?.fullName}`;
               // console.log("owner: "+ this.form.owner?.firstName  + "res:   "+ res.owner?.firstName);
                this.form.questions = res.questions.sort((q1, q2) => q1.idx - q2.idx);
                this.isInstancied = res.isInstancied;
                this.toggleState = this.form.isPublic;
                //console.log("instancied: " + this.isInstancied);
                if (this.isInstancied) {
                    this.dialog.open(WarningDialog);
                }
            });
            this.owner = this.form.owner;
            this.dataService.setData(this.form);
        }
        
    }


    deleteQuestion(id: number) {
      
        this.formService.deleteQuestion(id).subscribe(res => {
            if (res) {
                this.form.questions = this.form.questions.filter(q => q.id != id);
            }
        });
        //console.log('formservice: '+ id);
    }

    deleteFormDialog() {
        this.dialog.open(DeleteFormDialog, {autoFocus: true}).afterClosed().subscribe(res => {
            if(res) {
                this.formService.deleteForm(this.form.formId).subscribe(res => {
                    //console.log("form deleted: " + res);
                    this.router.navigate(['/view_forms']);
                    
                });
            }
        });
    }
    
    updateIdx(currentQuestion: Question, direction: string) {
       // console.log("down called");
        var currentIndex = this.form.questions.findIndex(q => q.id == currentQuestion.id);
        var index = direction == 'down'? currentIndex + 1 : currentIndex - 1;
        if (index >= 0 && index < this.form.questions.length - 1) {
            var nextQuestion = this.form.questions.at(index);
           // console.log("currentQuestion: " + currentQuestion.idx + " - next: " + nextQuestion?.idx );
            if (nextQuestion) {
                const tempIdx = currentQuestion.idx;
                currentQuestion.idx = nextQuestion.idx;
                nextQuestion.idx = tempIdx;
                this.form.questions.sort((q1, q2) => q1.idx - q2.idx);
                this.formService.updateQuestion(currentQuestion).subscribe();
        }
            //console.log("currentQuestion: " + currentQuestion.idx + "  next: " + nextQuestion?.idx );
            //this.formService.updateQuestion()


        }
      
    }

    trackByFn(index: number, question: Question): number {
        return question.id; // Utilisez un identifiant unique pour chaque question
    }

    canManageShare() {
        return this.currentUser == this.form.owner || this.currentUser?.roleAsString == 'admin';
    }

    togglePublicBtn() {
       // console.log("Initial isPublic: " + this.form.isPublic + ", toggleState: " + this.toggleState);
        this.dialog.open(PublicDialog, {
            data: { isPublic: this.toggleState }, autoFocus: true
        }).afterClosed().subscribe(result => {
            if (result) {
                this.formService.updatePublicForm(this.form.formId).subscribe(res => this.form.isPublic = this.toggleState);
            } else {
                this.toggleState = this.form.isPublic;
                //console.log("Change cancelled: toggleState = " + this.toggleState);
            }
        });
    }

    
    openAddEditForm() {
        this.router.navigate(["addEditForm"], {state: {form: this.form, isNew: false}});
    }
    openAddEditQuestion(isNew: boolean, index: number) {
        this.router.navigate(["addEditQuestion"], {state: {isNew: isNew, questionIndex: index, form: this.form}});
       // console.log('router: '+ isNew);
    }
    
    manageShares() {
        this.router.navigate(["/manage_shares"], {state: {form: this.form, isNew: false}});
    }
}
