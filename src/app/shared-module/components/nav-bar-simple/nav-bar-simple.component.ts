import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SwalService } from 'src/app/providers/swalService';
import { TokenStorage } from 'src/app/utilis/token.storage';

@Component({
  selector: 'app-nav-bar-simple',
  templateUrl: './nav-bar-simple.component.html',
  styleUrls: ['./nav-bar-simple.component.css'],
})
export class NavBarSimpleComponent implements OnInit, AfterViewInit {
  @Input() quantity: number = 0;
  currentUser!: any;
  rolesUser: any[] = [];

  constructor(
    private tokenStorage: TokenStorage,
    private route: Router,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    const token = this.tokenStorage.getToken();
    const currentUser = JSON.parse(this.tokenStorage.getCurrentUser());

    if (token && currentUser) {
      this.currentUser = currentUser;
      this.rolesUser = currentUser.roles.map((r: any) => r.name);
    }

    this.getPanier();
  }

  ngAfterViewInit(): void {}

  toogleMobileMenu() {
    const overlayMenu = window.document.querySelector(
      '.custom-menu-mobile-overlay'
    ) as HTMLElement;

    overlayMenu.classList.toggle('is-active');
  }

  getPanier() {
    const panier = JSON.parse(this.tokenStorage.getPanier());

    let list: Array<any> = [];
    if (panier && panier.products) {
      list = panier.products;
    }

    let quantityTotal = 0;
    list.forEach((element) => {
      quantityTotal = quantityTotal + element.quantity;
    });

    this.quantity = quantityTotal;
  }

  logOut() {
    const response$: Promise<boolean> = this.swalService.messageYesNo(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      'Non!',
      'Oui! Déconnectez'
    );
    response$.then((willsuccess) => {
      if (willsuccess) {
        this.tokenStorage.signOut();
        this.currentUser = null;
        this.rolesUser = [];
        this.route.navigateByUrl('/home');
      }
    });
  }
}
