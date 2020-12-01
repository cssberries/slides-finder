import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlidesModule } from './slides/slides.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { BlueberryFinderLogoComponent } from 'src/app/blueberry-logotype';
import { PersistencyResolver } from './persistency-resolver.service';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		SlidesModule,
		HttpClientModule,
		ClipboardModule,
		NgbModule,
	],
	declarations: [
		BlueberryFinderLogoComponent,
		AppComponent,
		NotFoundComponent,
	],
	providers: [PersistencyResolver],
	exports: [NgbModule],
	bootstrap: [AppComponent],
})
export class AppModule { }
