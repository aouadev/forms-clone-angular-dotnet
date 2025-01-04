import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {Instance} from "../../../models/instance";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: "email-question",
    templateUrl: "./emailQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class EmailQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instanceId?: number;
    @Output() validationChange = new EventEmitter<boolean>();
    public ctlEmailAnswer!: FormControl;
    private subscription!: Subscription;
    
    constructor(private fb: FormBuilder) {}
    
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['question'] && this.question) {
          if (this.subscription) {
              this.subscription.unsubscribe();
          }
          this.ctlEmailAnswer = this.fb.control(
              this.question?.answers?.[0]?.value || '',
              this.question?.required ? [Validators.required, Validators.email] : []
          );
          this.validationChange.emit(this.ctlEmailAnswer.valid);
          this.ctlEmailAnswer.valueChanges.subscribe(value => {
              this.validationChange.emit(this.ctlEmailAnswer.valid);
              if (this.question?.answers) {
                  this.question.answers[0] = {
                      instanceId: this.instanceId || 0,
                      questionId: this.question.id,
                      idx: 0,
                      value: value
                  };
              }
              if (this.question) {
                this.question.updated = true;
            }
          });
          this.ctlEmailAnswer?.markAllAsTouched();
      }
    }
}