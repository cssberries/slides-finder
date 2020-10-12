import { Component, OnInit, Input } from '@angular/core';
import { SlidesService } from 'src/app/slides/slides.service';
import tree from '../../../../../../tree.json';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'slides-explorer',
    templateUrl: './slides-explorer.component.html'
})
export class SlidesExplorerComponent implements OnInit {
    @Input() slides;
    @Input() selectedNode;
    private _subscriptions = new Subscription();

    constructor(private SlidesService: SlidesService, private router: Router, private layoutSvc: LayoutService,) {
        this._subscriptions.add(this.layoutSvc.slideLabelsHidden$.subscribe(val => this.slideLabelsHidden = val));
    }
    public route = '';
    public slideLabelsHidden;
    public getRoute(slideState) {
        // Implicitly sets absolute path plus adds prefix.
        let route = `/slides/${slideState}`;
        return route
    }

    public getSlidesList(node) {
        let list = this.flatSlidesList(node[0]);
        // console.log(list);

        return list;
    }

    private flatSlidesList(node) {
        let list = [];
        function traverse(node) {
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    list.push(node.children[i])
                    traverse(node.children[i]);
                }
            }
        }
        traverse(node);
        return list;
    }

    private findNode(node, path) {
        let result;
        function traverse(node, path) {
            if (node.path === `${path}.ts`) {
                result = node;
            } else
                if (node.children) {
                    for (let i = 0; i < node.children.length; i++) {
                        traverse(node.children[i], path);
                    }
                }
        }
        traverse(node, path);
        return result;
    }
    public remove(path) {
        event.stopPropagation();
        this.SlidesService.deleteSlide(this.findNode(tree[0], path));
    }

    ngOnInit() {
    }

}
