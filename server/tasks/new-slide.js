const fs = require( 'fs-extra' );
const randomize = require( 'randomatic' );

module.exports = {
    blank: function () {
        let slideName = '';
        slideName = `${randomize( 'A', 10 )}`;
        let componentContent =
            `
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: '${slideName}',
    templateUrl: 'template.html',
    
    })
    export class ${slideName} implements OnInit {
    constructor(
        private http: HttpClient,
        ) { }
    
    // myData: any;

    ngOnInit() {
        // this.http.get('assets/myData.json').subscribe((data) => {
        //     this.myData = data;
        // });
    }
}`
        templateContent =
            `
<div class="rows absolute-stretch">
    <div class="rows centerize">
        <div class="text--5xl">I'm a new slide!</div>
    </div>
</div>
`;
        styleContent = `
@import "../../styles";
`;
        let component = `mockups/${slideName}/component.ts`;
        let template = `mockups/${slideName}/template.html`;
        let style = `mockups/${slideName}/style.less`;
        fs.ensureDirSync( `mockups/${slideName}` );
        fs.writeFileSync( component, componentContent );
        fs.writeFileSync( template, templateContent );
        fs.writeFileSync( style, styleContent );
        return `${slideName}`
    },
    greeting: function ( slideName ) {
        let componentContent =
            `
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service'; // ds
import { HttpClient } from '@angular/common/http';
@Component({
    templateUrl: 'template.html',
    
    })
    export class ${slideName} implements OnInit {
    constructor(private dataSvc: DataService, 
private http: HttpClient,
) { }
    public getData(name) {
        return this.dataSvc.getData(name);
    }
    ngOnInit() {
    }
}`
        templateContent =
            `
<div class="rows absolute-stretch">
    <div class="bg--standout text-color-inverted--strongest padding--xxl">
        <div class="rows centerize">
            <div class="text--5xl">Welcome to slides-finder!</div>
            <div class="text--xxl">This is a default slide which you can delete whenever you want.</div>
        </div>
    </div>
    <div class="container padding-t--xl">
        <div class="grid grid--guttered--xl">
            <div class="grid__item col--md--4">
                <h3 class="text-center">Title</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae, labore iste fugiat error excepturi quibusdam, eaque nesciunt voluptatem accusantium necessitatibus reiciendis modi numquam dicta blanditiis voluptatum quam explicabo. Ducimus, sapiente.</div>
            <div class="grid__item col--md--4">
                <h3 class="text-center">Title</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae, labore iste fugiat error excepturi quibusdam, eaque nesciunt voluptatem accusantium necessitatibus reiciendis modi numquam dicta blanditiis voluptatum quam explicabo. Ducimus, sapiente.</div>
            <div class="grid__item col--md--4">
                <h3 class="text-center">Title</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae, labore iste fugiat error excepturi quibusdam, eaque nesciunt voluptatem accusantium necessitatibus reiciendis modi numquam dicta blanditiis voluptatum quam explicabo. Ducimus, sapiente.</div>
        </div>
    </div>
</div>
`;

        let component = `mockups/${slideName}/component.ts`;
        let template = `mockups/${slideName}/template.html`;
        let style = `mockups/${slideName}/style.less`;
        fs.ensureDirSync( `mockups/${slideName}` );
        fs.writeFileSync( component, componentContent );
        fs.writeFileSync( template, templateContent );
        return `${slideName}`
    }
}
