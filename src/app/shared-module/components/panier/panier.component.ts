import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit, AfterViewInit {
  @Input() quantity: number = 0;
  constructor(private route: Router) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  gotoPay() {
    if (this.quantity > 0) {
      this.route.navigateByUrl('/payment');
    }
  }
}
