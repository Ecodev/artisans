import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { CreateFile, CreateFileVariables, DeleteFile, FileInput } from '../../../shared/generated-types';

import { createFileMutation, deleteFileMutation } from './files.queries';

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
