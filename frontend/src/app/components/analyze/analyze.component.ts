import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {Question} from "../../models/question";
import {MatTableDataSource} from "@angular/material/table";
import {Answer} from "../../models/answer";
@Component({
    selector: "analyze",
    templateUrl: "./analyze.component.html",
    styleUrls: ["./analyze.component.css"]
})
export class AnalyzeComponent implements OnInit {
    form: Form;
    displayedColumns: string[] = ['Answer', 'Count', 'Ratio'];
    currentQuestion?: Question;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public selectedQuestionCtl!: FormControl;
    public frm!: FormGroup;
    constructor(private fb: FormBuilder,
                private router: Router,
                private formService: FormService,) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.selectedQuestionCtl = this.fb.control('');
        this.frm = this.fb.group({
            questions: this.fb.array([]),
            selectedQuestionCtl:   this.selectedQuestionCtl
        });
        
        
    }
    
    ngOnInit() {
        if(this.form) {
            this.formService.getFormWithAllInstances(this.form.formId).subscribe(res=> {
                this.form = res;
                this.currentQuestion = this.form.questions[0];
                this.dataSource.data = this.analyzeAnswers();
                console.log(res);

                this.frm = this.fb.group({
                    questions: this.fb.array(this.form.questions),
                    selectedQuestionCtl:   this.selectedQuestionCtl
                });
                this.selectedQuestionCtl.valueChanges.subscribe(value => {
                    this.currentQuestion = value;
                    if(this.currentQuestion) 
                        this.dataSource.data = this.analyzeAnswers();
                })
              
                

             
            })
        }
    }
    analyzeAnswers() {
        if (!this.currentQuestion || !this.currentQuestion.answers) {
            return [];
        }
        const idxLabelMap = new Map<string, string>();
        if(this.currentQuestion.optionList) {
           const optionValues = this.currentQuestion.optionList.optionValues;
        //  const idxLabelMap = new Map(optionValues.map(o => [o.idx, o.label]));
            optionValues.forEach(ov => {
                idxLabelMap.set(ov.idx.toString(), ov.label);
            });
        }
        const totalAnswers = this.currentQuestion.answers.length;
        const answerCounts = new Map<string, number>();
        this.currentQuestion.answers.forEach(answer => {
            const label  = idxLabelMap.get(answer.value) || answer.value;
            if (answerCounts.has(label)) {
                answerCounts.set(label, answerCounts.get(label)! + 1);
            } else {
                answerCounts.set(label, 1);
            }
        });
        const analyzedAnswers = Array.from(answerCounts.entries()).map(([value, count]) => {
            return {
                value: value,
                count: count,
                ratio: ((count / totalAnswers) * 100).toFixed(2) // Formaté en pourcentage
            };
        });

        return analyzedAnswers;
    }


}