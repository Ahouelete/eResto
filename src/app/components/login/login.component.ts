import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDTO } from 'src/app/back-office-module/components/list-customer/list-customer.component';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Customer } from 'src/app/models/customer';
import { Login } from 'src/app/models/login';
import { Person } from 'src/app/models/person';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/providers/customerServices';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { AuthService } from 'src/app/utilis/auth.service';
import { TokenStorage } from 'src/app/utilis/token.storage';
import { matchValidator } from 'src/app/customValidator/passwordValidator';
import { UserService } from 'src/app/providers/userService';
import jwt_decode from 'jwt-decode';
import { GlobalService } from 'src/app/providers/globalService';
import { Role } from 'src/app/models/roles';

interface ResetPassword {
  username: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  routeUrl: string = '';
  signupForm!: FormGroup;
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  error!: ApiResponse;
  saveButtonName = '';
  resetPasswordToken!: string;
  usernameResetPassword!: string;
  roleCustomer!: Role[];

  constructor(
    private route: Router,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.allRoles();
    this.createLoginForm();
    this.createResetPasswordForm();
    this.createSignupForm();
    this.routeVersPage();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  allRoles() {
    this.userService.getRoles(0, 10).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.roleCustomer = data.object.content.filter(
            (r: any) => r.name == 'ROLE_ADMIN'
          );
        }
      },
    });
  }

  signup(signup: CustomerDTO) {
    if (this.saveButtonName == 'INSCRIPTION EN COURS ...') return;
    this.saveButtonName = 'INSCRIPTION EN COURS ...';

    const person: Person = {
      id: null,
      lastName: signup.lastName,
      firstName: signup.firstName,
      email: signup.email,
    };

    const user: User = {
      id: null,
      person,
      username: signup.email,
      roles: [...this.roleCustomer],
      active: true,
      password: 'try',
    };

    const customer: Customer = {
      id: null,
      user,
      adress: signup.adress,
    };

    const signupRespons$: Observable<any> =
      this.customerService.create(customer);

    signupRespons$.subscribe({
      next: (data: ApiResponse) => {
        this.saveButtonName = "S'INSCRIRE";

        this.error = data;
        if (data.success) {
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.signupForm.reset();
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = "S'INSCRIRE";

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.error = {
          message: errorMsg,
          success: false,
          object: null,
        };
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  login(login: Login) {
    if (this.saveButtonName == 'CONNEXION EN COURS ...') return;

    this.saveButtonName = 'CONNEXION EN COURS ...';
    const loginResponse$: Observable<any> = this.authService.attemptAuth(login);

    loginResponse$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.storeCurrentUser(data);
        } else {
          this.saveButtonName = 'SE CONNECTER';

          this.error = data;
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'SE CONNECTER';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.error = {
          message: errorMsg,
          success: false,
          object: null,
        };
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  resetPassWord(formData: ResetPassword) {
    if (this.saveButtonName == 'REINITIALISATION EN COURS ...') return;
    this.saveButtonName = 'REINITIALISATION EN COURS ...';

    const paylaod = {
      token: this.resetPasswordToken,
      password: formData.password,
    };

    const resetPassWord$ = this.authService.resetPassword(paylaod);

    resetPassWord$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.route.navigateByUrl('/login');
        } else {
          this.saveButtonName = 'REÎNITIALISER MOT DE PASSE';
          this.error = data;
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'REÎNITIALISER MOT DE PASSE';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.error = {
          message: errorMsg,
          success: false,
          object: null,
        };
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  createSignupForm() {
    this.signupForm = this.fb.group({
      id: [null],
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      adress: [null, [Validators.required]],
      email: [null, [Validators.required]],
    });
  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      username: [{ value: null, disabled: true }, [Validators.required]],
      password: [
        null,
        [Validators.required, matchValidator('confirmPassword', true)],
      ],
      confirmPassword: [
        null,
        [Validators.required, matchValidator('password')],
      ],
    });
  }

  routeVersPage() {
    if (this.route.url.startsWith('/signup')) {
      this.saveButtonName = "S'INSCRIRE";
      this.routeUrl = 'signup';
    } else if (this.route.url.startsWith('/reset-password/')) {
      this.getDataResetPassword();

      this.saveButtonName = 'REÎNITIALISER MOT DE PASSE';
      this.routeUrl = 'reset-password';
    } else {
      this.saveButtonName = 'SE CONNECTER';
      this.routeUrl = 'login';
    }
  }

  storeCurrentUser(data: ApiResponse) {
    const userResponseApi$ = this.userService.getUserByUsername(data.message);

    // console.log(jwt_decode(data.object.token));
    userResponseApi$.subscribe({
      next: (responseApi: ApiResponse) => {
        this.saveButtonName == 'SE CONNECTER';

        if (responseApi.success) {
          this.tokenStorage.saveToken(data.object.token);
          this.tokenStorage.saveCurrentUser(JSON.stringify(responseApi.object));
          this.route.navigateByUrl('/home');
        } else {
          this.error = responseApi;
          this.swalService.message(responseApi.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName == 'SE CONNECTER';
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.error = {
          message: errorMsg,
          success: false,
          object: null,
        };
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  getDataResetPassword() {
    this.usernameResetPassword =
      this.activatedRoute.snapshot.params['username'];
    this.resetPasswordToken =
      this.activatedRoute.snapshot.params['resetPasswordToken'];

    this.resetPasswordForm.controls['username'].setValue(
      this.usernameResetPassword
    );

    if (!(this.usernameResetPassword && this.resetPasswordToken)) {
      this.swalService.message(
        'Votre token est invalide ou contient une erreur',
        TYPE_ERROR.ERROR
      );
    }
  }
}
