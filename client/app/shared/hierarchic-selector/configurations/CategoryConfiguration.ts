import { HierarchicConfiguration } from '../classes/HierarchicConfiguration';
import { CategoryService } from '../../../admin/categories/services/category.service';

export const CategoryConfiguration: HierarchicConfiguration[] = [
    {
        service: CategoryService,
        parentsFilters: ['parents'],
        childrenFilters: ['parents'],
        selectableAtKey: 'category',
    },
];

