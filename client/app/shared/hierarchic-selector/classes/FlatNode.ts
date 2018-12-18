import { ModelNode } from './ModelNode';

export class FlatNode {

    public loading = false;

    constructor(public node: ModelNode,
                public name: string,
                public level: number = 0,
                public expandable: boolean = false,
                public selectable: boolean = true,
                public deselectable: boolean = true) {
    }
}
