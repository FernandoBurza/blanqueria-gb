import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
})
export class AccessComponent {
constructor(private router: Router) { }

    logout(){
        this.router.navigate(['/auth/login']);
    }
}