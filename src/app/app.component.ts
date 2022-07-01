import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  chartData = [];

  ngOnInit() {
    this.loadData();
  }

  buttonClick() {
    this.chartData = [];
    this.loadData();
  }

  loadData() {
    for (let i = 0; i < 8 + Math.floor(Math.random() * 20); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }
}
