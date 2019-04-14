import { BehaviorSubject } from 'rxjs';
import { HierarchicConfiguration } from './HierarchicConfiguration';

export class ModelNode {

    public childrenChange: BehaviorSubject<ModelNode[]> = new BehaviorSubject<ModelNode[]>([]);

    constructor(public model: any,
                public config: HierarchicConfiguration) {
    }

    get children(): ModelNode[] {
        return this.childrenChange.getValue();
    }
}
