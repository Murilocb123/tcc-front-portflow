import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-main-layout',
    standalone: false,
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
    public layoutClass: string = ''
    public started = false;

    constructor() {}

    ngOnInit(): void {
        const colorScheme = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim();
        if (colorScheme === 'light') {
            this.layoutClass = 'layout-light';
        } 
        this.started = true;
    }

}
