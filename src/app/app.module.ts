import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthService } from './modules/auth/login/services/auth.service';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { LoadingService } from './shared/services/loading.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService } from 'primeng/dynamicdialog';
import { PopupService } from 'src/app/shared/services/popup.service';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

// ✅ Importa servicios desde la API modular de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    HttpClientModule,
    CommonModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa la app
    provideAuth(() => getAuth()),                                     // Provee el servicio de Auth
    provideFirestore(() => getFirestore()),                           // Provee el servicio de Firestore
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    AuthService,
    LoadingService,
    DialogService,
    PopupService,
    //MercadoPagoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }