import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridColumnComponent } from './components/grid-column/grid-column.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {path: "", pathMatch: 'full', redirectTo: 'dashboard'},
  {path: "dashboard", component: DashboardComponent},
  {path: "grid-col", component: GridColumnComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
