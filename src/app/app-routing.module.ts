import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersistencyResolver } from './persistency-resolver.service';


const routs: Routes = [
	{
		path: 'slides',
		resolve: {
			slides: PersistencyResolver
		},
		loadChildren: () =>
			import('./slides/slides.module').then(
				(m) => m.SlidesModule
			),
	},
	{ path: '', redirectTo: 'slides/mockups', pathMatch: 'full' },
]


@NgModule({
	imports: [
		RouterModule.forRoot(routs)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
