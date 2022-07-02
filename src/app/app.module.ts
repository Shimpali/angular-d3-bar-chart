import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, BarChartComponent  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
