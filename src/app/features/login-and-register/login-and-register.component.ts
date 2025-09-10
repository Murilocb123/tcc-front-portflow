import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';

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

    themeMode: 'light' | 'dark' = 'light';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.loginFormGroup = this.getLoginFormGroup();
        this.registerFormGroup = this.getRegisterFormGroup();
        const colorScheme = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim();
        if (colorScheme === 'dark') {
            this.themeMode = 'dark';
        } else {
            this.themeMode = 'light';
        }
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

    onLoginSubmit(form: any) {
        if (form.valid) {
            const input = {
                email: form.value.email,
                password: form.value.password
            }
            this.authService.login(input)
                .pipe(
                    catchError((error) => {
                        if (error.status === 403) {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Acesso Negado',
                                detail: 'Sua conta ainda não foi aprovada. Por favor, aguarde a aprovação do administrador.'
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro de Login',
                                detail: 'Credenciais inválidas. Por favor, tente novamente.'
                            });
                        }
                        // this.loadingState = false;
                        throw error;
                    }))
                .subscribe({
                    next: (response) => {
                        console.log('Login bem-sucedido:', response);
                        // Redirecionar ou realizar outras ações após o login
                    }
                });
        }
    }

    onRegisterSubmit(form: any) {
        if (form.valid) {
            //this.loadingState = true;

            const input = {
                name: form.value.username,
                email: form.value.email,
                password: form.value.password
            }
            this.authService.register(input)
                .pipe(
                    catchError((error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro de Registro',
                            detail: 'Não foi possível registrar o usuário. Por favor, tente novamente.'
                        });
                        // this.loadingState = false;

                        throw error;
                    }))
                .subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Registro bem-sucedido',
                            detail: 'Usuário registrado com sucesso. Aguarde aprovação...'
                        });
                        this.tabActive = TabActive.LOGIN; // Volta para a aba de login após o registro
                    }
                });
        }
    }

}

