import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import { th } from 'date-fns/locale';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {User} from 'src/app/models/user';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';
    currentUser?: User;
    
    constructor(private router: Router, private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUser;
    }
     
    logout() {
        this.authenticationService.logout();
    }
    
}
