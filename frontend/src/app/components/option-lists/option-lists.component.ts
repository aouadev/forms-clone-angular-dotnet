import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { is, th } from "date-fns/locale";
import { OptionList } from "src/app/models/optionList";
import { Question } from "src/app/models/question";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { QuestionService } from "src/app/services/question.service";
import { DeleteOptionDialogComponent } from "./delete-dialogue.component";
import { Route, Router } from "@angular/router";

@Component({
    selector: 'option-lists',
    templateUrl: 'option-lists.component.html',
    styleUrls: [
        '../add-edit-form/add-edit-form.component.css'
    ]
})
export class OptionListsComponent implements OnInit{
    public myOptionLists?: OptionList[];
    private allQuestions?: Question[];
    private currentUser?: User;
   

    constructor(
        private questionService: QuestionService,
        private authenticationservice: AuthenticationService,
        private dialog: MatDialog,
        private router: Router

    ) {
        this.currentUser = this.authenticationservice.currentUser;
    }

    ngOnInit(): void {
        this.questionService.getMyOptionLists().subscribe(res =>{
            this.myOptionLists = res;
            console.log("res: ", res);
        });
        this.questionService.getAllQuestion().subscribe(res => {
            this.allQuestions = res;
            
        })
    }

    public isNotEditable(option: OptionList) {
        const isReferenceed = this.allQuestions?.some(q => q.optionListId === option.id) ?? false;
        const isNotAdmin = option.ownerId == null && this.currentUser?.roleAsString !== 'Admin';

          return isReferenceed || isNotAdmin;                  
    }

    public deleteOption(id: number) {
        this.dialog.open(DeleteOptionDialogComponent).afterClosed().subscribe(res =>{
            if (res) {
                this.questionService.deleteOptionList(id).subscribe(res =>{

                   
                    if (res) {
                        this.myOptionLists = this.myOptionLists?.filter(o => o.id !== id);
                        console.log("deleted", res);
                    }

                });

        }
           
        });
    }
  

    
}