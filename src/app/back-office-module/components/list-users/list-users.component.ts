import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ROLES_NAME, Role } from 'src/app/models/roles';
import { User } from 'src/app/models/user';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { UserService } from 'src/app/providers/userService';

export interface UserDTO {
  id: number | null | undefined;
  lastName: string;
  firstName: string;
  roles: Role[];
  email: string;
}

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  roles: any[] = [];
  users: any[] = [];
  action = 'ON_CREATE';
  userForm!: FormGroup;
  saveButtonName = 'Enregistrer';
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  currentUser!: User | null;

  constructor(
    private userService: UserService,
    private swalService: SwalService,
    private globalService: GlobalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createUserForm();
    this.allRoles();
    this.allUser(this.pageNo, this.pageSize);
  }

  allUser(pageIndex: number, pageSize: number) {
    this.loading = true;
    const users$: Observable<any> = this.userService.all(pageIndex, pageSize);

    users$.subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.users = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  allRoles() {
    this.userService.getRoles(0, 10).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.roles = data.object.content;
        }
      },
    });
  }

  getRoleName(roles: Role[]) {
    let roleName = 'Client';
    const rolesName = roles.map((r) => r.name);

    if (rolesName.includes(ROLES_NAME.ROLE_ADMIN)) roleName = 'Administrateur';

    return roleName;
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allUser(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.currentUser = null;

    this.userForm.reset();
  }

  onUpdate(user: User) {
    this.currentUser = user;

    const userDTO: UserDTO = {
      id: user.id,
      lastName: user.person.lastName,
      firstName: user.person.firstName,
      roles: user.roles,
      email: user.person.email,
    };

    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.userForm.setValue(userDTO);
  }

  onDelete(user: User) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette boissons ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteUser(user);
      }
    });
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required]],
      lastName: [null],
      roles: [null, [Validators.required]],
      email: [null, [Validators.required]],
    });
  }

  compareFn(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onSave(userDTO: UserDTO) {
    const user: User = {
      id: this.action == 'ON_CREATE' ? null : this.currentUser?.id,
      username: userDTO.email,
      roles: userDTO.roles,
      person: {
        id: this.action == 'ON_CREATE' ? null : this.currentUser?.person?.id,
        lastName: userDTO.lastName,
        firstName: userDTO.firstName,
        email: userDTO.email,
      },
      active: true,
    };

    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';
        this.createUser(user);
        break;

      case 'ON_UPDATE':
        if ((this.saveButtonName = 'Modification en cours ...')) return;
        this.saveButtonName == 'Modification en cours ...';
        this.updateUser(user);
        break;

      default:
        break;
    }
  }

  createUser(user: User) {
    const responseApi$: Observable<any> = this.userService.create(user);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.users.unshift(data.object);
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);

          this.onCreate();
        } else {
          this.saveButtonName = 'Enregistrer';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Enregistrer';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  updateUser(user: User) {
    const responseApi$: Observable<any> = this.userService.update(
      user.id as number,
      user
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.users.findIndex((d) => d.id == user.id);
          this.users.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0,
            data.object
          );

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
        } else {
          this.saveButtonName = 'Modifier';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Modifier';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  deleteUser(user: User) {
    const responseApi$: Observable<any> = this.userService.delete(
      user.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.users.findIndex((d) => d.id == user.id);
          this.users.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0
          );

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }
}
