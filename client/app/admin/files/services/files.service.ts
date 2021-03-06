import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    CreateFile,
    CreateFileVariables,
    DeleteFile,
    DeleteFileVariables,
    FileInput,
} from '../../../shared/generated-types';
import {createFileMutation, deleteFileMutation} from './files.queries';

@Injectable({
    providedIn: 'root',
})
export class FilesService extends NaturalAbstractModelService<
    any,
    any,
    any,
    any,
    CreateFile['createFile'],
    CreateFileVariables,
    any,
    any,
    DeleteFile,
    DeleteFileVariables
> {
    constructor(apollo: Apollo) {
        super(apollo, 'file', null, null, createFileMutation, null, deleteFileMutation);
    }

    protected getDefaultForServer(): FileInput {
        return {
            file: '',
        };
    }
}
