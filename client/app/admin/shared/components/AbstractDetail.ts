import { isArray, kebabCase, merge, mergeWith } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractController } from '../../../shared/components/AbstractController';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { AbstractModelService, VariablesWithInput } from '../../../shared/services/abstract-model.service';
import { Literal } from '../../../shared/types';

export class AbstractDetail<Tone,
    Vone,
    Tcreate extends { id: string; },
    Vcreate extends VariablesWithInput,
    Tupdate,
    Vupdate extends { id: string; input: Literal; },
    Tdelete>
    extends AbstractController implements OnInit {

    public data: any = {
        model: {},
    };

    public form: FormGroup;

    public showFabButton = true;

    constructor(private key: string,
                public service: AbstractModelService<Tone, Vone, any, any, Tcreate, Vcreate, Tupdate, Vupdate, Tdelete>,
                protected alertService: AlertService,
                protected router: Router,
                protected route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.data = merge({model: this.service.getEmptyObject()}, {model: this.service.getDefaultValues()}, data[this.key]);
            this.initForm();
        });
    }

    public changeTab(index) {
        this.showFabButton = index === 0;
    }

    public update(): void {

        if (!this.data.model.id) {
            return;
        }

        if (this.form && this.form.invalid) {
            return;
        }

        if (this.form) {
            this.formToData();
        }

        this.service.update(this.data.model).subscribe(model => {
            this.alertService.info('Mis à jour');
            if (this.form) {
                this.form.patchValue(model);
            }
            this.postUpdate(model);
        });
    }

    public create(redirect: boolean = true): Observable<Tcreate> | null {

        this.validateAllFormFields(this.form);
        if (this.form && this.form.invalid) {
            return null;
        }

        if (this.form) {
            this.formToData();
        }

        const obs = new Subject<Tcreate>();
        this.service.create(this.data.model).subscribe(model => {
            this.alertService.info('Créé');
            obs.next(model);
            this.form.patchValue(model);
            this.postCreate(model);

            if (redirect) {
                this.router.navigate(['..', model.id], {relativeTo: this.route});
            }
        });

        return obs;
    }

    /**
     * Recursively mark descending form tree as dirty and touched in order to show all unvalidated fields on demand (create action mainly)
     */
    public validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({onlySelf: true});
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    public delete(): void {
        this.alertService.confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.service.delete([this.data.model]).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.router.navigate(['../../' + kebabCase(this.key)], {relativeTo: this.route});
                    });
                }
            });
    }

    protected postUpdate(res: any) {
    }

    protected postCreate(res: any) {
    }

    protected initForm(): void {
        const formConfig = this.service.getFormConfig(this.data.model);
        this.form = new FormGroup(formConfig, {validators: this.service.getFormGroupValidators()});
    }

    private formToData() {
        mergeWith(this.data.model, this.form.value, (dest, src) => {
            if (isArray(src)) {
                return src;
            }
        });
    }
}
