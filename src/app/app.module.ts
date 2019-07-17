import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HomeComponent } from './home/home.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { PriceProbabilityComponent } from './price-probability/price-probability.component';
import { DeliveranceSpeedComponent } from './deliverance-speed/deliverance-speed.component';
import { QualityAssuranceComponent } from './quality-assurance/quality-assurance.component';
import { ClientSatisfactionComponent } from './client-satisfaction/client-satisfaction.component';
import { ChartComponent } from './chart/chart.component';
import { RandomChartComponent } from './random-chart/random-chart.component';
import { TagCloudComponent } from './tag-cloud/tag-cloud.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NewZealandComponent } from './new-zealand/new-zealand.component';
import { CarRaceComponent } from './car-race/car-race.component';
import { RoadCodeComponent } from './road-code/road-code.component';
import { FernComponent } from './fern/fern.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactsComponent,
    CalculatorComponent,
    HowItWorksComponent,
    PriceProbabilityComponent,
    DeliveranceSpeedComponent,
    QualityAssuranceComponent,
    ClientSatisfactionComponent,
    ChartComponent,
    RandomChartComponent,
    TagCloudComponent,
    PieChartComponent,
    NewZealandComponent,
    CarRaceComponent,
    RoadCodeComponent,
    FernComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
