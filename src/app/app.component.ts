import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  chartData = [];

  ngOnInit() {
    for (let i = 0; i < 8 + Math.floor(Math.random() * 10); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

  buttonClick() {
    this.chartData = [];
    for (let i = 0; i < 8 + Math.floor(Math.random() * 10); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

}
