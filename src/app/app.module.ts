import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { AuthHandlerInterceptor } from './interceptor/auth-handler.interceptor';
import { AdminComponent } from './modules/admin/admin.component';

import { HospitalModule } from './modules/hospital/hospital.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminInterceptor } from './interceptor/admin.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { AgmDirectionModule } from 'agm-direction';
import { ChartsModule } from 'ng2-charts';
import { HospitalComponent } from './modules/hospital/hospital.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModules } from './material.module';
// import { AgmMap, MouseEvent, MapsAPILoader } from '@agm/core';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

@NgModule({
  declarations: [AppComponent, AdminComponent, HospitalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    HospitalModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY,
      libraries: ['places'],
    }),
    NgSelectModule,
    GooglePlaceModule,

    NgSelectModule,
    FormsModule,
    // ChartsModule
    MatNativeDateModule,
    MaterialModules,
    // MaterialExampleModule
    AbilityModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptor,
      multi: true,
    },
    { provide: Ability, useValue: new Ability() },
    { provide: PureAbility, useExisting: Ability }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
