import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Question } from "src/app/models/question";

@Component({
    selector: 'short-question',
    templateUrl: 'shortQuestion.component.html',
    styleUrls: [
        '../instance.component.css'
    ]
})
export class ShortQuestionComponent implements OnChanges, OnDestroy {
    @Input() question?: Question;
    @Input() instanceId?: number;
    public ctlShortAnswer!: FormControl;
    private subscription!: Subscription;

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            // Si une subscription existe déjà, désabonne-la
            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            // Crée un nouveau FormControl
            this.ctlShortAnswer = this.fb.control(
                this.question?.answers?.[0]?.value || '', 
                this.question?.required ? [Validators.required] : []
            );

            // Abonne-toi aux changements de valeur
            this.subscription = this.ctlShortAnswer.valueChanges.subscribe(value => {
                console.log('value:::' + value);
                // Mets à jour la réponse associée
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

            // Marque comme touché pour afficher les erreurs dès le chargement
            this.ctlShortAnswer.markAllAsTouched();
        }
    }

    ngOnDestroy(): void {
        // Nettoie les abonnements pour éviter les fuites de mémoire
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
