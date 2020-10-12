import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesExplorerComponent } from './slides-explorer/slides-explorer.component';
// import { SlideLoaderComponent } from './slide-loader.component';
// import { SlideHostDirective } from './slide-host/slide-host.directive';
// import { SlideService } from './slide-host/slide-host.service';
import { SlidesList } from './slides-list.module';
import { SlidesListMap } from './slides-list.module';
import { SlidesComponent } from './slides.component';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { UiComponentsModule } from '../shared/ui-components/ui-components.module';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SlidesRoutingModule } from './slides-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [
        SlidesExplorerComponent,
        SlidesList,
        // SlideLoaderComponent,
        // SlideHostDirective,
        SlidesComponent,
    ],
    imports: [
        FormsModule,
        UiComponentsModule,
        CommonModule,
        RouterModule,
        SlidesRoutingModule,
        TreeModule.forRoot(),
        ClickOutsideModule,
        DragDropModule,
        ComponentsModule,
        NgbModule
    ],
    entryComponents: [
        SlidesList
    ],
    exports: [
        UiComponentsModule,
        ComponentsModule,
        SlidesExplorerComponent,
        // SlideLoaderComponent,
        // SlideHostDirective,
        SlidesComponent,
        NgbModule
    ]
})

export class SlidesModule { }
