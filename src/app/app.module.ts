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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { HttpInterceptorService } from './http-interceptor.service';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ModalComponent,
    NavbarComponent,
    GridColumnComponent,
    AddAccountModalComponent,
    ModalContainerComponent,
    SettingsModalComponent,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
