import {Component, Input, OnInit} from '@angular/core';
import {NaturalAbstractModelService, NaturalQueryVariablesManager} from '@ecodev/natural';

@Component({
    selector: 'app-tags-navigation',
    templateUrl: './tags-navigation.component.html',
    styleUrls: ['./tags-navigation.component.scss'],
})
export class TagsNavigationComponent implements OnInit {
    /**
     * Items to list
     */
    @Input() public items: {name: string; id?: string};

    /**
     * Service to use to get items
     */
    @Input() public service: NaturalAbstractModelService<any, any, any, any, any, any, any, any, any, any>;

    /**
     * Url base
     */
    @Input() linkBase: any[] = [];

    /**
     *
     */
    @Input() linkToAttribute = 'name';

    constructor() {}

    ngOnInit() {
        if (this.service) {
            const qvm = new NaturalQueryVariablesManager<any>();
            this.service.getAll(qvm).subscribe(result => {
                this.items = result.items;
            });
        }
    }

    getLink(item) {
        return [...this.linkBase, item[this.linkToAttribute]];
    }
}
