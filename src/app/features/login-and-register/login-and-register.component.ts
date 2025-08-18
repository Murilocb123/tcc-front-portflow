import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

export enum TabActive {
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
}

@Component({
    selector: 'app-login-and-register',
    standalone: false,
    templateUrl: './login-and-register.component.html',
    styleUrl: './login-and-register.component.scss',
    animations: [
        trigger('tabsAnimations', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class LoginAndRegisterComponent {
    TabActive = TabActive; // Expose the enum to the template
    tabActive: TabActive = TabActive.LOGIN;

    loginFormGroup: FormGroup;
    registerFormGroup: FormGroup;

    MEDIUM_REGEX =
        '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';
    STRONG_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.loginFormGroup = this.getLoginFormGroup();
        this.registerFormGroup = this.getRegisterFormGroup();
    }

    setTabActive(tab: TabActive) {
        this.tabActive = tab;
    }

    getLoginFormGroup(): FormGroup {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    getRegisterFormGroup(): FormGroup {
        return this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.pattern(new RegExp(this.MEDIUM_REGEX)),
                ],
            ],
            // valida se é igual a senha
            confirmPassword: [
                '',
                [Validators.required],
                this.passwordMatchValidator(),
            ],
        });
    }

    passwordMatchValidator(): AsyncValidatorFn {
        return async (): Promise<ValidationErrors | null> => {
            console.log('Validating password match');
            const password = this.registerFormGroup?.get('password')?.value;
            const confirmPassword =
                this.registerFormGroup?.get('confirmPassword')?.value;
            return password === confirmPassword
                ? null
                : { passwordNoMatch: true };
        };
    }

    isInvalidInputRegister(controlName: string): boolean {
        const control = this.registerFormGroup.get(controlName);
        return !!(control && control.invalid && control.dirty);
    }

    isInvalidInputLogin(controlName: string): boolean {
        const control = this.loginFormGroup.get(controlName);
        return !!(control && control.invalid && control.dirty);
    }

    getErrorMessageRegister(controlName: string): string {
        if (controlName === 'username') {
            if (this.registerFormGroup.get(controlName)?.hasError('required')) {
                return 'Nome de usuário é obrigatório.';
            }
        }
        if (controlName === 'email') {
            if (this.registerFormGroup.get(controlName)?.hasError('required')) {
                return 'Email é obrigatório.';
            }
            if (this.registerFormGroup.get(controlName)?.hasError('email')) {
                return 'Email inválido';
            }
        }
        if (controlName === 'password') {
            if (this.registerFormGroup.get(controlName)?.hasError('required')) {
                return 'Senha é obrigatória.';
            }
            if (
                this.registerFormGroup.get(controlName)?.hasError('minlength')
            ) {
                return 'A senha deve ter no mínimo 6 caracteres.';
            }
            if (this.registerFormGroup.get(controlName)?.hasError('pattern')) {
                return 'A senha deve conter letras e números.';
            }
        }
        if (controlName === 'confirmPassword') {
            if (this.registerFormGroup.get(controlName)?.hasError('required')) {
                return 'Confirmação de senha é obrigatória.';
            }
            if (
                this.registerFormGroup
                    .get(controlName)
                    ?.hasError('passwordNoMatch')
            ) {
                return 'As senhas não são iguais.';
            }
        }
        return '';
    }

    getErrorMessageLogin(controlName: string): string {
        if (controlName === 'email') {
            if (this.loginFormGroup.get(controlName)?.hasError('required')) {
                return 'Email é obrigatório.';
            }
            if (this.loginFormGroup.get(controlName)?.hasError('email')) {
                return 'Email inválido';
            }
        }
        if (controlName === 'password') {
            if (this.loginFormGroup.get(controlName)?.hasError('required')) {
                return 'Senha é obrigatória.';
            }
        }
        return '';
    }

    login() {
        if (this.loginFormGroup.valid) {
            const loginData = this.loginFormGroup.value;
            this.authService.login(loginData).subscribe({
                next: () => {
                    console.log('Login successful');
                },
                error: (err) => {
                    console.error('Login failed', err);
                },
            });
        } else {
            console.warn('Login form is invalid');
        }
    }

    register() {
        if (this.registerFormGroup.valid) {
            const userData = this.registerFormGroup.value;
            this.authService.register(userData).subscribe({
                next: () => {
                    console.log('Registration successful');
                },
                error: (err) => {
                    console.error('Registration failed', err);
                },
            });
        } else {
            console.warn('Register form is invalid');
        }
    }
}

