import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { createFileMutation, deleteFileMutation } from './files.queries';
import {
    FileInput,
    CreateFile,
    CreateFileVariables,
    DeleteFile,
} from '../../../shared/generated-types';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class FilesService extends NaturalAbstractModelService<any,
    any,
    any,
    any,
    CreateFile['createFile'],
    CreateFileVariables,
    any,
    any,
    DeleteFile> {

    constructor(apollo: Apollo) {
        super(apollo,
            'image',
            null,
            null,
            createFileMutation,
            null,
            deleteFileMutation);
    }

    protected getDefaultForServer(): FileInput {
        return {
            file: '',
            product: null,
        };
    }

}
