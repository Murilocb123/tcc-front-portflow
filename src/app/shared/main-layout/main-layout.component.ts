import {
    Component,
    Input,
    OnInit,
    Signal,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoadingPageService } from '../loading-page/loading-page.service';

@Component({
    selector: 'app-main-layout',
    standalone: false,
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
    title: string = '';
    public layoutClass: string = '';
    public showChild = false;
    public isLoading = false;
    private loadingSub?: Subscription;
    private reloadChildSub?: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingPageService,
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
        this.loadingSub = this.loadingService.loading$.subscribe((loading) => {
            this.isLoading = loading;
            if (loading) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        this.reloadChildSub = this.loadingService.reloadChild$.subscribe(() => {
            this.reloadChild();
        });
        this.showChild = true;
    }

    reloadChild() {
        this.loadingService.show();
        this.showChild = false;
        setTimeout(() => {
            this.showChild = true;
            this.loadingService.hide();
        }, 500);
    }

    ngOnDestroy(): void {
        this.loadingSub?.unsubscribe();
        this.reloadChildSub?.unsubscribe();
    }
}
