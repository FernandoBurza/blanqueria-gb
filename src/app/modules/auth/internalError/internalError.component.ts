import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-internalError',
    templateUrl: './internalError.component.html',
})
export class InternalErrorComponent { 
    constructor(private router: Router) { }

    logout(){
        this.router.navigate(['/auth/login']);
    }
}