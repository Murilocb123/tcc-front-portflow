import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingPageService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private reloadChildSubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingSubject.asObservable();
    reloadChild$: Observable<boolean> = this.reloadChildSubject.asObservable();

    private loadingCount = 0;

    show() {
        this.loadingCount++;
        this.loadingSubject.next(true);
    }

    hide() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        if (this.loadingCount === 0) {
            this.loadingSubject.next(false);
        }
    }

    triggerReloadChild() {
        this.reloadChildSubject.next(true);
    }

    constructor() {}
}
