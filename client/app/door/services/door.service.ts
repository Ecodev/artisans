import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { openDoorMutation } from './door.queries';
import { OpenDoor } from '../../shared/generated-types';
import { Literal } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class DoorService {

    constructor(private apollo: Apollo) {
    }

    public doors: Literal = [
        {
            id: 'door',
            name: 'Entrée',
            image: 'door.jpg',
            opened: false,
        },
    ];

    public open(): Observable<OpenDoor['openDoor']> {

        return this.apollo.mutate<OpenDoor>({
            mutation: openDoorMutation,
        }).pipe(map(({data: {openDoor}}) => openDoor));
    }
}
