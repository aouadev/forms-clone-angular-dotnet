import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {plainToInstance} from "class-transformer";
import {Form} from "src/app/models/form";
import {OptionList} from "src/app/models/optionList";
import {Question, QuestionType} from "src/app/models/question";
import {QuestionService} from "src/app/services/question.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Role} from "../../models/user";
import {DataService} from "../../services/data.service";

@Component({
    selector:'add-edit-question',
    templateUrl: 'add-edit-question.component.html',
    styleUrls: [
        '../add-edit-form/add-edit-form.component.css'
    ]
})
export class AddEditQuestion implements OnInit {

    public question: Question;
    public form: Form;
    public frm!: FormGroup;
    public isNew: boolean;
    public hasOptionList: boolean = false;
    public optionLists?: OptionList[];
    questionTypes: {key: number, value: string }[] = []
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private questionService: QuestionService,
        private authService: AuthenticationService,
        private dataService: DataService){
        const navigation = this.router.getCurrentNavigation();
        const questionIndex = navigation?.extras.state?.['questionIndex'];
        this.form = navigation?.extras.state?.['form'];
        this.question = questionIndex >= 0 ?this.form.questions[questionIndex] : new Question();
     
        
        this.isNew = navigation?.extras.state?.['isNew'];
        
       
        this.questionTypes = Object.keys(QuestionType)
                            .filter(key => !isNaN(Number(key)))
                            .map(key => ({key: Number(key), value: QuestionType[key as any]}));
       // console.log("objectkeys ",this.questionTypes);
    }

    ngOnInit(): void {
        this.frm = this.fb.group({
            title: [this.question?.title || '', [Validators.required, Validators.minLength(3)]],
            description: [this.question?.description, Validators.minLength(3)],
            type: [this.question?.type, [Validators.required]],
            optionListId: [this.question?.optionListId],
            required: [this.question?.required]
        });
        this.hasOptionList = this.frm.value.type == 6 || this.frm.value.type == 7 || this.frm.value.type == 8;
        this.frm.get('type')?.valueChanges.subscribe(value => {
            this.hasOptionList = value == 6 || value == 7 || value == 8;
                
        });
        this.dataService.setData(this.form);
        const ownerId = this.form.ownerId;
        this.questionService.getOptionLists(ownerId).subscribe( res => {
            this.optionLists = res});
        this.frm.markAllAsTouched();
       // console.log("enum: " ,QuestionType)
    }

    saveQuestion() {
        const questionToSave = plainToInstance(Question, {...this.question, ...this.frm.value});
        console.log("isNew : ", this.isNew);
        if (this.isNew) {
            questionToSave.formId = this.form.formId;
            // Calculer le maximum des idx existants et ajouter 1
            questionToSave.idx = this.form.questions.length > 0
                ? Math.max(...this.form.questions.map(q => q.idx)) + 1
                : 1; // Si aucune question n'existe, démarrer à 1
        }
        questionToSave.optionList = this.optionLists?.find(o => o.id == questionToSave.optionListId);
       // console.log("idx: ", this.form.questions[this.form.questions.length - 1].idx);
        console.log("questionToSave", questionToSave);
      this.questionService.postQuestion(questionToSave).subscribe(res => 
               this.router.navigate(['viewForm'], {state: {data: this.form}})
        );
       
    }
    canEditOptionList() {
        return this.authService.currentUser?.id == this.form.ownerId 
            || this.authService.currentUser?.role == Role.Admin
            || this.form.isEditor;
    }
}