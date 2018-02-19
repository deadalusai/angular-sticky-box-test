import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

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
    RouterModule.forRoot(ROUTES),

    HomeModule,
    Example1Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
