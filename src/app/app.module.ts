import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComunasRestService} from 'src/app/core/api/comunasRest.service'; 
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { FarmaciasRestService } from './core/api/farmaciasRest.service';
import { MarkersService } from './services/markers.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './core/http/httpinterceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpClient,ComunasRestService,FarmaciasRestService,MarkersService,{provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
