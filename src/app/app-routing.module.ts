import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { HomeComponent } from './home/home.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { RandomChartComponent } from './random-chart/random-chart.component';
import { NewZealandComponent } from './new-zealand/new-zealand.component';
import { CarRaceComponent } from './car-race/car-race.component';
import { RoadCodeComponent } from './road-code/road-code.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'howitworks', component: HowItWorksComponent },
  { path: 'random-chart', component: RandomChartComponent },
  { path: 'game', component: CarRaceComponent },
  // { path: 'new-zealand', component: NewZealandComponent },
  { path: 'road-code', component: RoadCodeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
