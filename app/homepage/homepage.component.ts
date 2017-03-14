import { Component } from '@angular/core';

@Component({
    selector: 'home-page',
    template: require('./homepage.component.html')
})

//Home page
export class HomePageComponent {

    constructor() {
    }

    onViewCreated() {
        //do something on view created 
    }
}
