import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesExplorerComponent } from './slides-explorer/slides-explorer.component';
import { SlidesList } from '../../../../../../finder/slides-list.module';
// import { SlidesListMap } from '../../../../../../finder/slides-list.module';
import { SlidesComponent } from './slides.component';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { UiComponentsModule } from '../shared/ui-components/ui-components.module';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SlidesRoutingModule } from './slides-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../../../../render/components/components.module';
import { AngularSplitModule } from "angular-split";
@NgModule({
    declarations: [
        SlidesExplorerComponent,
        SlidesList,
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
        NgbModule,
        AngularSplitModule,
    ],
    entryComponents: [
        SlidesList
    ],
    exports: [
        UiComponentsModule,
        ComponentsModule,
        SlidesExplorerComponent,
        SlidesComponent,
        NgbModule
    ]
})

export class SlidesModule { }
