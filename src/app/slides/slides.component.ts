import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { TREE_ACTIONS, KEYS, ITreeState, ITreeOptions, TreeModel, TreeNode } from 'angular-tree-component';
import { Router, Event, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { SlidesList } from '../../../../../slides-list.module';
import { StorageService } from '../storage.service';
import { SlidesService } from './slides.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { LayoutService } from '../layout.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IframeService } from '../iframe.service';

@Component({
    templateUrl: './slides.component.html',
    styles: []
})
export class SlidesComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('slidesTree', { static: false }) slidesTree;

    public theme = 'mf--light';

    private _SUBSCRIPTIONS = new Subscription();
    public activeNodeIsFolder = true;
    public persistency = [];
    public tree: any;
    public nodes: any;
    public sidebarClosed;
    public slideToolbarClosed;
    public isFullscreen;
    public activeNode;
    public treeFilterValue;
    slideUrl: any;

    isProduction = environment.production;

    public activeRoute: string = this.router.url || this.storage.get('activeRoute') || 'slides';

    treeOptions: ITreeOptions = {
        isExpandedField: 'expanded',
        actionMapping: {
            mouse: {
                click: TREE_ACTIONS.TOGGLE_ACTIVE,
                expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
                checkboxClick: TREE_ACTIONS.TOGGLE_SELECTED,
                drop: TREE_ACTIONS.MOVE_NODE
            },
            keys: {
                [KEYS.RIGHT]: TREE_ACTIONS.DRILL_DOWN,
                [KEYS.LEFT]: TREE_ACTIONS.DRILL_UP,
                [KEYS.DOWN]: TREE_ACTIONS.NEXT_NODE,
                [KEYS.UP]: TREE_ACTIONS.PREVIOUS_NODE,
                [KEYS.SPACE]: TREE_ACTIONS.TOGGLE_ACTIVE,
                [KEYS.ENTER]: TREE_ACTIONS.TOGGLE_ACTIVE
            }
        },
        allowDrag: (node) => {
            return true;
        },
        allowDrop: (node) => {
            return true;
        },
        useVirtualScroll: false,
        scrollOnActivate: false,
        animateExpand: false,
        animateSpeed: 0.5,
        animateAcceleration: 1,
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private storage: StorageService,
        private slidesService: SlidesService,
        private layoutSvc: LayoutService,
        private location: Location,
        private iframeSvc: IframeService,
        sanitizer: DomSanitizer
    ) {
        this.route.data
            .subscribe(
                (data: Data) => {
                    this.persistency = data['slides'];
                    this.tree = this.persistency[0];
                    this.nodes = this.persistency;
                }
            );
        this.theme = this.storage.get('theme') || 'mf--light';
        this.slideUrl = sanitizer.bypassSecurityTrustResourceUrl(`${environment.domainName}`);

        this._SUBSCRIPTIONS.add(this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.activeNode = this.findNodeByState(this.tree, this.router.url);

                // console.log('NavigationEnd');
                this.initIframe(this.activeNode.state)

                // replaces escaped space gotten from browser
                this.activeNodeIsFolder = this.isFolder(this.tree, event.url.replace(/%20/g, ' '));
                if (event.url.includes('slides')) {
                    this.storage.set('activeRoute', event.url.replace(/%20/g, ' '));
                }
                if (this.slidesTree) {
                    const node = this.findNodeByState(this.tree, this.storage.get('activeRoute'));
                    const someNode = this.slidesTree.treeModel.getNodeById(node.id);
                    this.expandParent(someNode);
                }
            }
        }));

        this._SUBSCRIPTIONS.add(this.layoutSvc.sidebarClosed$.subscribe(val => this.sidebarClosed = val));
        this._SUBSCRIPTIONS.add(this.layoutSvc.slideToolbarClosed$.subscribe(val => this.slideToolbarClosed = val));
        this._SUBSCRIPTIONS.add(this.layoutSvc.isFullscreen$.subscribe(val => {
            this.isFullscreen = val;
        }));
    }

    public clearFilter() {
        this.slidesTree.treeModel.clearFilter();
        this.treeFilterValue = null;
    }


    filterFn(value: string, treeModel: TreeModel) {
        treeModel.filterNodes((node: TreeNode) => this.fuzzySearch(value, node.data.name));
    }


    fuzzySearch(needle: string, haystack: string) {
        const haystackLC = haystack.toLowerCase();
        const needleLC = needle.toLowerCase();

        const hlen = haystack.length;
        const nlen = needleLC.length;

        if (nlen > hlen) {
            return false;
        }
        if (nlen === hlen) {
            return needleLC === haystackLC;
        }
        outer: for (let i = 0, j = 0; i < nlen; i++) {
            const nch = needleLC.charCodeAt(i);

            while (j < hlen) {
                if (haystackLC.charCodeAt(j++) === nch) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    }

    public toggleNodeEditingMode(mode, node) {
        if (mode === false) {
            this.rename(node);
        }
        node.nodeIsInEditingMode = mode;
        event.stopPropagation();
    }

    onEvent = ($event) => {
        if ($event.eventName === 'moveNode') {
            const newState = `/slides/${$event.to.parent.state}/${$event.node.id}`;
            this.location.go(newState);
            this.storage.set('activeRoute', newState);
            this.slidesService.moveSlides(
                {
                    node: $event.node,
                    from: $event.from,
                    to: $event.to,
                    newModel: $event.treeModel.nodes
                }
            );
        }
    }

    private findNodeByState(node: any, stt: any) {
        const state = stt.replace('/slides/', '').replace(/%20/g, ' ');
        let result;
        function traverse(n: any, st: any) {
            if (n.state === st) {
                result = n;
            } else
                if (n.children) {
                    for (const child of n.children) {
                        traverse(child, st);
                    }
                }
        }

        traverse(node, state);
        return result;
    }

    public getPath(path) {
        return path[path.length - 1];
    }

    public duplicate() {
        this.slidesService.duplicate(this.findNodeByState(this.tree, this.router.url.replace('/slides/', '').replace(/%20/g, ' ')));
    }

    public rename(node) {

        const stateParts = node.data.state.split('/');
        stateParts.pop();
        let parentState = stateParts.join('/');
        if (parentState !== '') {
            parentState = `${parentState}/`;
        }
        const newState = [`slides/${parentState}${node.data.name}`];

        this.activeRoute = newState[0];

        this.storage.set('activeRoute', newState);
        this.router.navigate(['slides']);
        this.slidesService.rename(node.data);

        event.stopPropagation();
    }

    public addFolder(node) {
        this.slidesService.addFolder(node.data);
        event.stopPropagation();
    }

    public deleteFolder(node) {
        this.slidesService.deleteFolder(node.data);
        event.stopPropagation();
    }

    public addSlide(node) {
        this.slidesService.addSlide(node.data);
        event.stopPropagation();
    }

    public updateAllSnapshots() {
        this.slidesService.updateSnapshots('', true);
    }
    public updateSnapshots() {
        this.slidesService.updateSnapshots(this.findNodeByState(this.tree, this.router.url.replace('/slides/', '').replace(/%20/g, ' ')), false);
    }
    public editTS() {
        this.slidesService.editSlideTS(this.findNodeByState(this.tree, this.router.url.replace('/slides/', '').replace(/%20/g, ' ')));
    }

    public editHTML() {
        this.slidesService.editSlideHTML(this.findNodeByState(this.tree, this.router.url.replace('/slides/', '').replace(/%20/g, ' ')));
    }

    public deleteSlide(node) {
        this.slidesService.deleteSlide(node);
        event.stopPropagation();
    }

    public removeActiveSlide() {
        this.slidesService.deleteSlide(this.activeNode);
        const stateParts = this.activeNode.state.split('/');
        stateParts.pop();
        const parentState = stateParts.join('/');
        const newState = [`slides/${parentState}`];
        this.storage.set('activeRoute', newState);
        this.router.navigate(newState);

        event.stopPropagation();
    }

    searchTree(node, path) {
        if (path === '/slides/' + node.state) {
            return node;
        } else if (node.children != null) {
            let result = null;
            for (let i = 0; result == null && i < node.children.length; i++) {
                result = this.searchTree(node.children[i], path);
            }
            return result;
        }
    }

    isFolder(tree, path) {
        let isFolder = false;
        const matchedNode = this.searchTree(tree, path);
        if (matchedNode) {
            if (matchedNode.children) {
                if (matchedNode.children) {
                    isFolder = true;
                } else { isFolder = false; }
            }
        }
        return isFolder;
    }
    get state(): ITreeState {
        return localStorage.treeState && JSON.parse(localStorage.treeState);
    }

    set state(state: ITreeState) {
        localStorage.treeState = JSON.stringify(state);
    }
    public setTheme(themeName: any) {
        this.theme = themeName;
        document.firstElementChild.setAttribute('class', themeName);
        this.storage.set('theme', this.theme);
        this.iframeSvc.sendMessage({ type: 'theme', theme: themeName })

    }

    ngOnInit() {

        this.setTheme(this.theme);
        this.router.navigate([this.activeRoute.replace(/%20/g, ' ')]);
    }

    ngOnDestroy(): void {
        this._SUBSCRIPTIONS.unsubscribe();
    }

    public expandParent(node) {
        if (node.isLeaf) {
            traverse(node);
        }
        function traverse(n: any) {
            if (n.parent) {
                n.expand();
                traverse(n.parent);
            }
        }
        this.scrollTo(node);
    }

    scrollTo(node) {
        const slideId = `#${node.data.id}`;
        const slidesTreeElement = document.querySelector(slideId);
        setTimeout(() => {
            slidesTreeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }

    public initIframe(path) {
        const slideRender = document.getElementById('slideRender');
        // console.log('iframe initiated');

        if (!slideRender) {
            console.log('iframe undefined...');
            return;
        }

        const iWindow = (slideRender as HTMLIFrameElement).contentWindow;

        iWindow.postMessage({ route: path, type: 'navigation' }, '*');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const node = this.findNodeByState(this.tree, this.storage.get('activeRoute'));
            if (node) {
                const someNode = this.slidesTree.treeModel.getNodeById(node.id);
                this.expandParent(someNode);
            }
            this.iframeSvc.sendMessage({ type: 'theme', theme: this.theme })
            this.initIframe(this.activeNode.state);
        }, 1000);
    }
}
