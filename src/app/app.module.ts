import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { HotkeyModule } from 'angular2-hotkeys';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlidesModule } from './slides/slides.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { BlueberryFinderLogo } from 'src/app/blueberry-logotype';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		SlidesModule,
		HttpClientModule,
		ClipboardModule,
		HotkeyModule.forRoot(),
		NgbModule,
	],
	declarations: [
		BlueberryFinderLogo,
		AppComponent,
		NotFoundComponent,
	],
	entryComponents: [],
	exports: [
		NgbModule
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
