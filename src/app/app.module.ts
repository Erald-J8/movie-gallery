import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MovieGalleryModule } from './movie-gallery/movie-gallery.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MovieGalleryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
