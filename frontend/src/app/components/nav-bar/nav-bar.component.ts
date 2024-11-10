import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import { th } from 'date-fns/locale';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';
    
    constructor(private router: Router, private authentifaicationService: AuthenticationService) {
    }
     
    logout() {
        this.authentifaicationService.logout();
    }
    
}
