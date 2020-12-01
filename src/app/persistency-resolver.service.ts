import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Slide } from './slides/slide';
import { SlidesService } from './slides/slides.service';


@Injectable({
  providedIn: 'root'
})

export class PersistencyResolver implements Resolve<Slide> {


  constructor(private slidesSvs: SlidesService) { }

  resolve(): Observable<Slide> | Promise<Slide> | Slide {
    return this.slidesSvs.getPersistency();
  }

}
