import { HierarchicConfiguration } from './HierarchicConfiguration';
import { Literal } from '../../../types/types';

export interface HierarchicFilterConfiguration<T = Literal> {
    service: HierarchicConfiguration['service'];
    filter: T;
}

export interface HierarchicFiltersConfiguration<T = Literal> extends Array<HierarchicFilterConfiguration<T>> {
}
