import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    @Input() backUrl: string = '<undefind>';
    @Input() isHome: boolean =false;
   // @Output() askToggleFilter: EventEmitter<void> = new EventEmitter<void>();
    currentUser?: User;
    guestMode?: boolean;
    
    constructor(private router: Router, private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUser;
        this.guestMode = authenticationService.GuestMode;
    }
     
    logout() {
        this.authenticationService.logout();
    }
    goBack() {
        this.router.navigate([this.backUrl]);
    }
    /*toggleFilter(){
        this.askToggleFilter.emit();
        console.log("emit");
    }*/
    
}
