import {Component, Inject, Input, OnInit} from "@angular/core";
import {Form} from "../../models/form"
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {MatSelectionList} from "@angular/material/list";
import {DeleteInstanceDialogComponent} from "../instance/delete-instance-dialog/delete-instance-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteInstancesDialogComponent} from "./delete-instance-dialog.component.";

@Component({
    selector: "view-instances",
    templateUrl: "./view-instances.component.html",
    styleUrls: ["./view-instances.component.css"]
    
})
export class ViewInstancesComponent implements OnInit {
    public form: Form;
    public frm!: FormGroup;
    public instancesArray!: FormArray;
    
    
    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private dataService: DataService,
                private formService: FormService,
                private instanceService: InstanceService,
                private dialog: MatDialog,) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['data'];
      /*  this.instancesArray = this.formBuilder.array([]);
        this.frm = this.formBuilder.group({
            instances: this.instancesArray
        });*/
        
    }
    ngOnInit() {
        if (this.form) {
          this.initForm();
        }
      
    }
    initForm() {
        this.formService.getFormWithAllInstances(this.form.formId).subscribe(res => {
            this.form = res;
          
            this.dataService.setData(this.form);
            //  this.instancesArray.setValue(this.form.instances);

        });
        
    }
    

    deleteSelectedInstances(instances: MatSelectionList) {
        if(instances) {
            this.dialog.open(DeleteInstancesDialogComponent, {autoFocus: true, data: 'selected'}).afterClosed().subscribe(res => {
                if (res) {
                    const selectedInstances = instances.selectedOptions.selected.map(option => option.value?.instanceId);
                    console.log("selectedInstances", selectedInstances);
                    if (selectedInstances.length > 0) {
                        this.form.instances = this.form.instances.filter(instance => !selectedInstances.includes(instance.instanceId));
                        this.instanceService.deleteInstances(selectedInstances)
                            .subscribe(res => {
                                if (res) {
                                    console.log(true);
                                }
                            });
                    }
                }

            });
        }

    }

    deleteAllInstances() {
        this.dialog.open(DeleteInstancesDialogComponent, {autoFocus: true, data: 'all'}).afterClosed().subscribe(res => {
            if (res) {
                const allInstanceIds = this.form.instances.map(instance => instance.instanceId);
                if (allInstanceIds.length > 0) {
                    this.instanceService.deleteInstances(allInstanceIds)
                        .subscribe(() => {
                            this.form.instances = [];
                        });
                }
            }
        })
      
    }
}