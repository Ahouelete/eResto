import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-ingredient',
  templateUrl: './list-ingredient.component.html',
  styleUrls: ['./list-ingredient.component.css'],
})
export class ListIngredientComponent implements OnInit {
  ingredients: any[] = [];
  foods: any[] = [];
  totalRecords = 0;
  constructor() {}

  ngOnInit(): void {}
}
