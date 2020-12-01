import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'slides',
    templateUrl: './slides-listing.component.html'
})
export class SlidesListingComponent implements OnInit {
    public selectedNode;
    public activeRoute: string;
    public tree: any;

    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.parent.data
            .subscribe(
                (data: Data) => {
                    this.tree = data['slides'];
                }
            );
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {   
                this.traverseTree(this.tree[0], this.location.path().replace(/%20/g, ' ')); // replaces escaped space gotten from browser
                if (this.location.path() !== '') {
                    this.activeRoute = this.location.path();
                } else {
                    this.activeRoute = 'slides';
                }
            }
        });
    }
    traverseTree(n, path) {
        const node = n;
        if ('/slides/' + node.state === path) {
            this.selectedNode = [node];
            return this.selectedNode;
        } else if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                this.traverseTree(node.children[i], path);
            }
        }
    }
    ngOnInit() {
    }
}
