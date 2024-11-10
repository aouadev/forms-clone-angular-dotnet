import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { MyFormsComponent } from '../components/myforms/myforms.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent },
    {path: 'myforms', component: MyFormsComponent},
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
