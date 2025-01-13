import { O } from "@angular/cdk/keycodes";
import { Component, Inject, inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { th } from "date-fns/locale";
import { OptionList } from "src/app/models/optionList";
import { OptionValue } from "src/app/models/optionValue";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { QuestionService } from "src/app/services/question.service";
import {MatDialog} from "@angular/material/dialog";
import { CancelDialogComponent } from "./cancel-dialog.component";
import {option} from "yargs";
import { MatListOption } from "@angular/material/list";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {forEach} from "lodash-es";


@Component({
    selector:'add-edit-option-value',
    templateUrl: 'add-edit-option-list.component.html',
    styleUrls: [
        'add-edit-option-list.component.css'
    ]
})
export class AddEditOptionComponent implements OnInit{
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    public currentUser?: User
    public frm!: FormGroup;
    public isCopy = false;
    public isNew = false;
    public isSystem = false;
    private isChanged = false;
    idx : number;
    //optionListId = 0;
    optionList!: OptionList;
    constructor(private fb: FormBuilder,
                 private authenticationService: AuthenticationService,
                 private questionService: QuestionService,
                 private dialog: MatDialog) {
        const navigation = this.router.getCurrentNavigation();
        this.optionList = navigation?.extras.state?.['optionList'];
        this.isCopy = navigation?.extras.state?.['copy'];
        this.isNew = navigation?.extras.state?.['isNew'];
        if (!this.optionList) {
            this.optionList = new OptionList();
        }
        if(this.isCopy) {
            this.optionList.id = 0;
        }
        
        this.idx = this.optionList.optionValues.length ? 
                    this.optionList.optionValues.reduce((max, current) => 
                    Math.max(max, current.idx), 0) : 0;
      
        this.currentUser = this.authenticationService.currentUser;
        this.isSystem = this.currentUser?.role == 2 && this.optionList.ownerId == null;
        
    }


    ngOnInit(): void {
        /*this.route.params.subscribe(param => {
            this.optionListId = +param.optionListId;
        
        });*/
        this.frm = this.fb.group({
        name: [this.optionList?.name + (this.isCopy ? "(copy)" : ""), [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        optionValues : this.fb.array(
            (this.optionList.optionValues).map(option => this.fb.group({
                optionListId: [option.optionListId],
                idx: [option.idx],
                label: [option.label],
                checked: [option.checked],
            }))
        ),
        system: [this.isSystem],
        valueCtl: ['', [Validators.minLength(3), this.labelIsUnique()]]
        

       });
       this.frm.markAllAsTouched();
       this.frm.get('system')?.valueChanges.subscribe(value => {
            this.isSystem = value;
           // console.log("system: ", this.isSystem);
       });
       this.frm.valueChanges.subscribe(() => this.isChanged = true);
        console.log("before::", this.optionList.optionValues);
     
      
     
    }

    public addOption() {
        this.idx = ++this.idx;
        this.optionList.optionValues.push(
            {
            optionListId: this.optionList.id,
            idx: this.idx,
            label: this.frm.get('valueCtl')?.value,
            checked: false
            });
        this.frm.get('valueCtl')?.reset();
        
    }
    canSave() {
        return this.frm.valid && this.optionList.optionValues.length > 0;
    }

    saveOptionList() {
        if(this.frm.valid) {

            this.optionList.ownerId = this.currentUser?.role == 2 ? this.isSystem ? undefined : this.currentUser.id : this.currentUser?.id;
            this.optionList.name  = this.frm.get('name')?.value;
            console.log("optionList: ", this.optionList);
            this.questionService.addOptionList(this.optionList).subscribe(res => this.router.navigate(['optionLists']));
            
          
        }

    }

    // validateur pour vérifier si le label est unique dans cette optionList
    labelIsUnique(): any{
        //return this.optionList.optionValues.some(o => o.label == this.frm.get('label')?.value);
        return (ctl:FormControl) => {
            return this.optionList.optionValues.some(o =>o.label == ctl.value) ? {labelNotUnique: true} : null;
        };
    }
    openCancelDialog(): void {
        if(this.isChanged && this.frm.valid) {
            this.dialog.open(CancelDialogComponent).afterClosed().subscribe(res => {
                res ? this.router.navigate(['optionLists']) : this.saveOptionList();
            });
        } else {
            this.router.navigate(['optionLists']);
        }
    }
    
    deleteSelection(selectedOptions: MatListOption[]) {
        var selectedValues = selectedOptions.map(option => option.value);
        this.optionList.optionValues = this.optionList.optionValues
                                        .filter(o => !selectedValues.includes(o));
                                       
    }


    drop(event: CdkDragDrop<any>) {
        console.log(this.optionList.optionValues[event.previousIndex]);
        console.log(this.optionList.optionValues[event.currentIndex]);
        
        moveItemInArray(this.optionList.optionValues, event.previousIndex, event.currentIndex);
        console.log("after::", this.optionList.optionValues);
        let newIdx = 0;
        this.optionList.optionValues.forEach(option => option.idx = ++newIdx);
    }
}