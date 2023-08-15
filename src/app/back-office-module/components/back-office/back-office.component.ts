import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css'],
})
export class BackOfficeComponent implements OnInit {
  constructor(private route: Router) {}
  routeActivated = '';
  ngOnInit(): void {
    this.loadReallyPage();
  }

  loadReallyPage() {
    if (this.route.url.endsWith('back-office/list-drink'))
      this.routeActivated = 'list-drink';

    if (this.route.url.endsWith('back-office/list-meal'))
      this.routeActivated = 'list-meal';

    if (this.route.url.endsWith('back-office/list-user'))
      this.routeActivated = 'list-user';

    if (this.route.url.endsWith('back-office/livrer-commandes'))
      this.routeActivated = 'livrer-commandes';

    if (this.route.url.endsWith('back-office/list-ingredient'))
      this.routeActivated = 'list-ingredient';

    if (this.route.url.endsWith('back-office/record-menu'))
      this.routeActivated = 'record-menu';

    if (this.route.url.endsWith('back-office/list-customer'))
      this.routeActivated = 'list-customer';

    if (this.route.url.endsWith('back-office/list-payment'))
      this.routeActivated = 'list-payment';
  }
}
