import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public items: any[] = [];

    constructor() {
    }

    public add(item) {
        this.items.push(item);
        return this.items;
    }
}
