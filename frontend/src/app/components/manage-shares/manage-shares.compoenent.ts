import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {FormWithAccessData} from "../../models/form";
import {FormService} from "../../services/form.service";
import {AccessType} from "../../models/formAccesses";
import {DataService} from "../../services/data.service";
import {F} from "@angular/cdk/keycodes";
import {Subscription} from "rxjs";


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
    canAddUserAccess = false;
    isPublic = false;
    subscription!: Subscription;


    constructor(private router : Router, private fb: FormBuilder, 
                private formService : FormService,
                private dataService: DataService,
                private cdr: ChangeDetectorRef) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.isPublic = this.form.isPublic || false;
        this.dataService.setData(this.form);
        this.accessers = this.fb.array([]);
        this.usersToAddAccess = this.fb.array([]);
        this.userToAddCtl = this.fb.control('');
        this.accessTypeUserCtl = this.fb.control({value: this.isPublic , disabled: this.isPublic});
        this.accessTypeEditorCtl = this.fb.control('');
        this.frm = this.fb.group({
            accessers: this.accessers,
            usersToAddAccess: this.usersToAddAccess,
            userToAddCtl: this.userToAddCtl,
            accessTypeUserCtl: this.accessTypeUserCtl,
            accessTypeEditorCtl: this.accessTypeEditorCtl,
        });
        //this.canAddUserAccess = this.userToAddCtl.value && (this.accessTypeUserCtl.value || this.accessTypeEditorCtl.value);
    }

    ngOnInit() {
        this.formService.getFormAccesses(this.form.formId).subscribe(res => {
            if (res) {
                this.form = res;
                this.refresh();
            }
        });
    }

    refresh() {
        this.isPublic = this.form.isPublic || false;
        console.log("refresh");
        const accessers = this.form?.accesses?.map(ua =>
            this.fb.group({
                userCtl: this.fb.control({
                    value: ua.accessType == AccessType.User || ua.accessType == AccessType.Editor,
                    disabled: ua.accessType == AccessType.Editor
                }),
                editorCtl: this.fb.control(ua.accessType == AccessType.Editor),
            })
        );
        this.userToAddCtl.reset('');
        this.accessTypeUserCtl.reset(this.isPublic);
        this.accessTypeEditorCtl.reset(false);
        this.frm = this.fb.group({
            accessers: this.fb.array(accessers || []),
            usersToAddAccess: this.fb.array(this.form?.allUsersWithoutAdmins || []),
            userToAddCtl: this.userToAddCtl,
            accessTypeUserCtl: this.accessTypeUserCtl,
            accessTypeEditorCtl: this.accessTypeEditorCtl,
        });
        this.canAddUserAccess = this.userToAddCtl.value && (this.accessTypeUserCtl.value || this.accessTypeEditorCtl.value);
        // Abonnement unique pour surveiller les changements sur les trois contrôles
        this.subscription = this.frm.valueChanges.subscribe(() => {
            console.log('change');
            this.checkCanAddUserAccess();
        });
       // this.cdr.detectChanges();
        
    }

    updateAccesses(index: number) {
        const accessGroup = (this.frm.get('accessers') as FormArray).at(index) as FormGroup;
        const userCtl = accessGroup.get('userCtl')?.value;
        const editorCtl = accessGroup.get('editorCtl')?.value;
        console.log(userCtl);
        console.log("userid: ",this.form.accesses[index].userId);

        if ((!userCtl && !editorCtl) || (this.isPublic && !editorCtl) ) {
            this.formService.deleteAccess(this.form.accesses[index].userId, this.form.formId).subscribe(res => {
                if (res) {
                    this.formService.getFormAccesses(this.form.formId).subscribe(updatedForm => {
                        this.form = updatedForm;
                        this.refresh();
                    });
                }
            });
        }
        else {
            const user = this.form.accesses[index].user;
            if (user) {
                const access = {
                    user: user,
                    userId: user?.id,
                    formId: this.form.formId,
                    accessType: editorCtl ? AccessType.Editor : AccessType.User
                };
                console.log("access:", access);
                this.formService.addAccess(access).subscribe(res => {
                    if (res) {
                        //this.refresh();
                        
                    }
                })
            }
        }
        editorCtl ? accessGroup.get('userCtl')?.disable() : accessGroup.get('userCtl')?.enable();
    }
    
    displayUserName(user: any): string {
        return user ? `${user.firstName} ${user.lastName}` : '';
    }
    addUserAccess() {
        const user = this.userToAddCtl.value;
        const userType = this.accessTypeUserCtl.value;
        const editorType = this.accessTypeEditorCtl.value;
        if (user && (userType || editorType)) {
            const access = {user: user, userId: user.id, formId: this.form.formId, accessType: editorType ? AccessType.Editor : AccessType.User};
            this.formService.addAccess(access).subscribe(res => {
                if (res) {
                    this.form.accesses.push(access);
                    const index = this.form.allUsersWithoutAdmins.findIndex(u => u.id === user.id);
                    this.form.allUsersWithoutAdmins.splice(index, 1);
                    this.refresh(); 
                }
            })
        
           

        }
    }
    checkCanAddUserAccess() {
        const user = this.userToAddCtl.value;
        const userType = this.accessTypeUserCtl.value;
        const editorType = this.accessTypeEditorCtl.value;
        this.canAddUserAccess = !!user && ((!this.isPublic && ( userType|| editorType)) || (this.isPublic && editorType));
    }
    


}