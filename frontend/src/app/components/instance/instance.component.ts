import { Component } from "@angular/core";
import { Form } from "src/app/models/form";
import { Router } from "@angular/router";
import { Instance, InstanceWithFormDetailed } from "src/app/models/instance";
import { InstanceService } from "src/app/services/instance.service";
import { Question } from "src/app/models/question";

@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        './instance.component.css'
    ]
})
export class InstanceComponent {
    form: Form;
    instance?: InstanceWithFormDetailed;
    questions?: Question[];
    size?: number;
    constructor(private router: Router, private instanceService: InstanceService){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
    }

    ngOnInit() {
        this.instanceService.getInstance(this.form?.lastInstance.instanceId).subscribe((res) => {
            this.instance = res;
            this.questions = this.instance.form?.questions;
            this.size = this.questions?.length;
            console.log(res);
        })
    }

    arrowBack() {
        this.router.navigate(['/forms']);
    }
}