import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { ViewFormsComponent } from '../components/view-forms/view-forms.component';
import { InstanceComponent } from '../components/instance/instance.component';
import { ViewFormComponent } from '../components/view_form/viewForm.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent },
    {path: 'view_forms', component: ViewFormsComponent},
    {path: 'instance', component: InstanceComponent},
    {path: 'viewForm', component: ViewFormComponent},
    {   
        path: 'template',
        component: TemplateComponent,
        canActivate: [AuthGuard],
        data: { Roles: [Role.Admin] }

    },
    {path: 'restricted', component: RestrictedComponent },
    {path: '**', component: UnknownComponent}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
