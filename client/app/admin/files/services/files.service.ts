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
    never,
    never,
    never,
    never,
    CreateFile['createFile'],
    CreateFileVariables,
    never,
    never,
    DeleteFile,
    DeleteFileVariables
> {
    public constructor() {
        super('file', null, null, createFileMutation, null, deleteFileMutation);
    }

    public override getDefaultForServer(): FileInput {
        return {
            file: null as unknown as File,
        };
    }
}
