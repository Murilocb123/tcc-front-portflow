import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto } from './login';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../user-entity/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private readonly BASE_ROUTE = '/api/auth';
    private readonly API_URL = environment.BACKEND_URL;

    constructor(
      private httpClient: HttpClient, private router: Router
    ) {}

    login(newLogin: LoginDto) {
        return this.httpClient
            .post<any>(this.API_URL + this.BASE_ROUTE + '/login', newLogin)
            .pipe(
                tap((value) => {
                    sessionStorage.setItem('auth-token', value.token);
                    sessionStorage.setItem('username', value.name);
                    this.router.navigate(['/login']);
                })
            );
    }

    register(newUser: UserDto) {
        return this.httpClient.post<UserDto>(this.API_URL + this.BASE_ROUTE + '/register', newUser);
    }

}
