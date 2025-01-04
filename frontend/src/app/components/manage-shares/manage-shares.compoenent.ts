import {Component, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {FormWithAccessData} from "../../models/form";
import {FormService} from "../../services/form.service";
import {AccessType} from "../../models/formAccesses";
import {DataService} from "../../services/data.service";

@Component({
    selector: "manage-shares",
    templateUrl: "./manage-shares.component.html",
    styleUrls: ["./manage-shares.component.css"]
})
export class ManageSharesComponent implements OnInit{
    public form: FormWithAccessData;
    public frm!: FormGroup ;
    accessers! : FormArray;
    usersToAddAccess!: FormArray;
    userToAddCtl!: FormControl;
    accessTypeUserCtl!: FormControl;
    accessTypeEditorCtl!: FormControl;
    
    
    constructor(private router : Router, private fb: FormBuilder, private formService : FormService, private dataService: DataService) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.dataService.setData(this.form);
        this.accessers = this.fb.array([]);
        this.usersToAddAccess = this.fb.array([]);
        this.userToAddCtl = this.fb.control('');
        this.accessTypeUserCtl = this.fb.control('');
        this.accessTypeEditorCtl = this.fb.control('');
      
        this.frm = this.fb.group({
            accessers: this.accessers,
            usersToAddAccess: this.usersToAddAccess,
            userToAddCtl: this.userToAddCtl,
            accessTypeUserCtl: this.accessTypeUserCtl,
            accessTypeEditorCtl: this.accessTypeEditorCtl,
        });
       
  
      
        
    }
    
    ngOnInit() {
        this.formService.getFormAccesses(this.form.formId).subscribe(res => {
            if (res) {
                this.form = res;
                this.refresh();
                this.frm?.valueChanges.subscribe(value => {
                    console.log('value', value);
                    const userType = this.frm.get("accessTypeUserCtl")?.value;
                    const editorType = this.frm.get("accessTypeEditorCtl")?.value;
                    if (this.userToAddCtl?.value && (userType || editorType) ) {
                        const user = this.userToAddCtl?.value;
                        console.log("user:::", user);
                        const access = {user: user, userId: user.id, formId: this.form.formId, accessType: editorType? AccessType.Editor : AccessType.User };
                        this.form.accesses.push(access);
                        const index = this.form.allUsersWithoutAdmins.findIndex(u => u.id === user.id);
                        this.form.allUsersWithoutAdmins.splice(index, 1);
                        console.log(this.form.accesses);
                        this.refresh();
                        
                    }
                });
             
            }
        });
       
     
     
            
    }
    
    refresh() {
        const accessers = this.form?.accesses?.map((ua) =>
            this.fb.group({
                userCtl: this.fb.control({value: ua.accessType == AccessType.User
                        || ua.accessType == AccessType.Editor,
                    disabled: ua.accessType == AccessType.Editor}),
                editorCtl: this.fb.control(ua.accessType == AccessType.Editor),
            }));
        const usersToAddAccess = this.form?.allUsersWithoutAdmins;
        this.frm = this.fb.group({
            accessers: this.fb.array(accessers || []),
            usersToAddAccess: this.fb.array(usersToAddAccess),
            userToAddCtl: this.fb.control(''),
            accessTypeUserCtl: this.fb.control(''),
            accessTypeEditorCtl: this.fb.control(''),
        });
    }
  
    updateAccesses(index: number) {
        const accessGroup = (this.frm.get('accessers') as FormArray).at(index) as FormGroup;
        const userCtl = accessGroup.get('userCtl')?.value;
        const editorCtl = accessGroup.get('editorCtl')?.value;
        if(!userCtl && !editorCtl) {
            this.formService.deleteAccess(this.form.accesses[index].userId, this.form.formId).subscribe(res => {
                if (res) {
                    this.formService.getFormAccesses(this.form.formId).subscribe(res => {this.form = res;
                        this.refresh();
                    });
                 
                }
            });
           // this.form.accesses.splice(index, 1);
           // (this.frm.get('accessers') as FormArray).removeAt(index); ;
            
        }
        editorCtl ? accessGroup.get('userCtl')?.disable() : accessGroup.get('userCtl')?.enable();
        
  
    }

    protected readonly AccessType = AccessType;
}