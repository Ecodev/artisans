import { fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { HierarchicSelectorDialogService } from './hierarchic-selector-dialog.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HierarchicSelectorModule } from '../hierarchic-selector.module';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('HierarchicSelectorDialogService', () => {

    let dialog: HierarchicSelectorDialogService;
    let overlayContainer: OverlayContainer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                HierarchicSelectorModule,
            ],
            providers: [
                HierarchicSelectorDialogService,
            ],
        });
    });

    beforeEach(inject([
            HierarchicSelectorDialogService,
            OverlayContainer,
        ],
        (d: HierarchicSelectorDialogService, oc: OverlayContainer) => {
            dialog = d;
            overlayContainer = oc;
        }));

    afterEach(() => {
        overlayContainer.ngOnDestroy();
    });

    it('should open dialog, use and return the selected value', fakeAsync(() => {

        const config = [];
        const selected = {test: [{asdf: 'qwer'}]};
        const multiple = true;

        const dialogRef = dialog.open(config, multiple, selected);
        const dialogCloseSpy = spyOn(dialogRef, 'close');

        expect(dialogRef.componentInstance.config).toEqual(config);
        expect(dialogRef.componentInstance.selected).toEqual(selected);
        expect(dialogRef.componentInstance.multiple).toEqual(multiple);

        dialogRef.componentInstance.close(dialogRef.componentInstance.selected);

        flush();

        expect(dialogCloseSpy).toHaveBeenCalledWith(selected);
    }));

});
