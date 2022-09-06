import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'file', null, null, createFileMutation, null, deleteFileMutation);
    }

    protected getDefaultForServer(): FileInput {
        return {
            file: null as unknown as File,
        };
    }
}
