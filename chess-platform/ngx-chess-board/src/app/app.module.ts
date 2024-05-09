import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; 
import { RouterModule } from '@angular/router'; // Import RouterModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ActionsComponent } from './components/actions/actions.component';
import { FenComponent } from './components/fen/fen.component';
import { MovesComponent } from './components/moves/moves.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './header/header.component'; // Import HeaderComponent
import { NgModel } from '@angular/forms';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [
    ActionsComponent,
    FenComponent,
    MovesComponent,
    SettingsComponent,
    AppComponent
],
imports: [
    BrowserModule,
    HeaderComponent,
    FormsModule,
    NgxChessBoardModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([]), // Add RouterModule.forRoot([])
    CommonModule // Add CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
//   ngDoBootstrap() {} // Remove the ngDoBootstrap lifecycle hook

}
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
