import {
    Component,
    Input,
    OnInit,
    Signal,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-main-layout',
    standalone: false,
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
    title: string = '';

    public layoutClass: string = '';
    public started = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe(() => {
            this.activatedRoute?.firstChild?.title.subscribe((title) => {
                this.title = title || 'Sem título';
            });
        });
        const colorScheme = getComputedStyle(document.documentElement)
            .getPropertyValue('color-scheme')
            .trim();
        if (colorScheme === 'light') {
            this.layoutClass = 'layout-light';
        }
        this.started = true;
    }
}
