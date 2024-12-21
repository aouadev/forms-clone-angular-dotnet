import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AppRoutes} from '../routing/app.routing';

import {AppComponent} from '../components/app/app.component';
import {SetFocusDirective} from '../directives/setfocus.directive';
import {SharedModule} from './shared.module';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {fr} from 'date-fns/locale';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NavBarComponent} from "../components/nav-bar/nav-bar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {JwtInterceptor} from "../interceptors/jwt.interceptor";
import {UnknownComponent} from "../components/unknown/unknown.component";
import {TemplateComponent} from "../components/template/template.component";
import { LoginComponent } from '../components/login/login.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { ViewFormsComponent } from '../components/view-forms/view-forms.component';
import { FormCardComponent } from '../components/view-forms/form-card.component';
import { OpenFormConfirmComponent } from '../components/openFormConfirm/openFormConfirm.component';
import { InstanceComponent } from '../components/instance/instance.component';
import { QuestionCardComponent } from '../components/instance/QuestionCardComponent';
import { ShortQuestionComponent } from '../components/instance/shortQuestion/shortQuestion.component';
import {LongQuestionComponent} from "../components/instance/longQuestion/longQuestion.component";
import {DateQuestionComponent} from "../components/instance/dateQuestion/dateQuestion.component";
import {EmailQuestionComponent} from "../components/instance/emailQuestion/emailQuestion.component";
import {IntegerQuestionComponent} from "../components/instance/integerQuestion/integerQuestion.component";
import {CheckQuestionComponent} from "../components/instance/checkQuestion/checkQuestion.component";
import {ComboQuestionComponent} from "../components/instance/comboQuestion/comboQuestion.component";
import { RadioQuestionComponent} from '../components/instance/radioQuestion/radioQuestion.component';
import { ViewFormComponent } from '../components/view_form/viewForm.component';
import { viewQuestionCard } from '../components/view_form/viewQuestionCard.component';
import { DeleteQuestionDialog } from '../components/view_form/dialogs/deleteQuestionDialog.component';

@NgModule({
    declarations: [
        UnknownComponent,
        TemplateComponent,
        AppComponent, 
        SetFocusDirective,
        NavBarComponent,
        LoginComponent,
        RestrictedComponent,
        ViewFormsComponent,
        FormCardComponent,
        OpenFormConfirmComponent,
        InstanceComponent,
        QuestionCardComponent,
        ShortQuestionComponent,
        LongQuestionComponent,
        DateQuestionComponent,
        EmailQuestionComponent,
        IntegerQuestionComponent,
        CheckQuestionComponent,
        ComboQuestionComponent,
        RadioQuestionComponent,
        ViewFormComponent,
        viewQuestionCard,
        DeleteQuestionDialog
        
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        BrowserAnimationsModule,
        SharedModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: MAT_DATE_LOCALE, useValue: fr},
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: ['dd/MM/yyyy'],
                },
                display: {
                    dateInput: 'dd/MM/yyyy',
                    monthYearLabel: 'MMM yyyy',
                    dateA11yLabel: 'dd/MM/yyyy',
                    monthYearA11yLabel: 'MMM yyyy',
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
    ],
    exports: [
        NavBarComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
