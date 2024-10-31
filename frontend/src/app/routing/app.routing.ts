import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";

const appRoutes: Routes = [
    {path: '', component: LoginComponent, pathMatch: 'full'},
    { path: 'template',
        component: TemplateComponent
    },
    {path: '**', component: UnknownComponent}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
