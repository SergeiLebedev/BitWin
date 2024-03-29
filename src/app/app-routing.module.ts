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
import { FernComponent } from './fern/fern.component';
import { LeavesComponent } from './leaves/leaves.component';
import { MathComponent } from './math/math.component';

const routes: Routes = [
  //{ path: 'home', component: HomeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'math', component: MathComponent },
  //{ path: 'calculator', component: CalculatorComponent },
  //{ path: 'howitworks', component: HowItWorksComponent },
  { path: 'random-chart', component: RandomChartComponent },
  { path: 'game', component: CarRaceComponent },
  //{ path: 'new-zealand', component: NewZealandComponent },
  { path: 'road-code', component: RoadCodeComponent },
  { path: 'fern', component: FernComponent },
  { path: 'leaves', component: LeavesComponent },
  { path: '',   redirectTo: '/contacts', pathMatch: 'full' },
  { path: '**', redirectTo: '/contacts', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
