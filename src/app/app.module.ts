import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TeleportModule } from './teleport';

import { HomeModule, HomeComponent } from './home';
import { Example1Module, Example1Component } from './example1';

let ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'example1', component: Example1Component }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    
    // Router
    RouterModule.forRoot(ROUTES),
    HomeModule,
    Example1Module,

    // Page
    TeleportModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
