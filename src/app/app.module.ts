import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GridColumnComponent } from './components/grid-column/grid-column.component';
import { FormsModule } from '@angular/forms';
import { AddAccountModalComponent } from './components/add-account-modal/add-account-modal.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ModalComponent,
    NavbarComponent,
    GridColumnComponent,
    AddAccountModalComponent,
    ModalContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
