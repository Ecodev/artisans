import { BehaviorSubject, Observable } from 'rxjs';
import { fakeAsync, inject, tick } from '@angular/core/testing';
import { AbstractModelService } from '../services/abstract-model.service';
import { Literal } from '../types';
import { QueryVariablesManager } from '../classes/query-variables-manager';

// A shortcut for shorter lines
type ModelService = AbstractModelService<any, any, any, any, any, any, any, any, any>;

export abstract class AbstractModelServiceSpec {

    private static readonly notConfiguredMessage = 'GraphQL query for this method was not configured in this service constructor';

    private static expectNotConfiguredOrEqual(expectSuccess: boolean,
                                              getObservable: (any) => Observable<any>,
                                              variables: string | Literal | BehaviorSubject<string | Literal>,
                                              newVariables?: string | Literal): Observable<any> {
        let actual = null;
        let count = 0;
        let result: Observable<any>;

        const getActual = () => {
            result = getObservable(variables);
            result.subscribe(v => {
                count++;
                actual = v;
            });
            tick();
        };

        if (expectSuccess) {
            getActual();
            expect(actual).toEqual(jasmine.anything());
            expect(count).toBe(1);

            // Check that the next set of variables will trigger exactly 1 callback
            if (variables instanceof BehaviorSubject && newVariables) {
                variables.next(newVariables);
                tick();
                expect(count).toBe(2);
            }
        } else {
            expect(getActual).toThrowError(this.notConfiguredMessage);
        }

        return result;
    }

    private static expectNotConfiguredOrEqualForQueryVariablesManager(expectSuccess: boolean,
                                                                      getObservable: (any) => Observable<any>,
                                                                      qvm: QueryVariablesManager<any>,
                                                                      newVariables?: any): Observable<any> {
        let actual = null;
        let count = 0;
        let result = null;
        const tickDelay = 20; // should match AbstractModel.watchAll debounceTime value

        const getActual = () => {
            result = getObservable(qvm);
            tick(tickDelay);
            result.subscribe(v => {
                count++;
                actual = v;
            });
            tick(tickDelay);
        };

        if (expectSuccess) {
            getActual();
            expect(actual).toEqual(jasmine.anything());
            expect(count).toBe(1);

            if (newVariables) {
                qvm.set('channel', newVariables);
                tick(tickDelay);
                expect(count).toBe(2);
            }

        } else {
            expect(getActual).toThrowError(this.notConfiguredMessage);
        }

        return result;
    }

    /**
     * Test all common methods defined on AbstractModelService
     */
    public static test(serviceClass,
                       expectedOne: boolean = true,
                       expectedAll: boolean = true,
                       expectedResolve: boolean = true,
                       expectedCreate: boolean = true,
                       expectedUpdate: boolean = true,
                       expectedDelete: boolean = true): void {

        const error = 'Cannot use Observable as variables. Instead you should use .subscribe() to call the method with a real value';

        it('should be created', inject([serviceClass], (service: ModelService) => {
            expect(service).toBeTruthy();
        }));

        it('should get one',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqual(expectedOne, (vars) => service.getOne(vars), '123');
            })),
        );

        it('should not get one with observable',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                tick();
                expect(() => service.getOne(new BehaviorSubject('123') as any).subscribe()).toThrowError(error);
            })),
        );

        it('should get all with query variables manager',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqualForQueryVariablesManager(expectedAll,
                    (vars) => service.getAll(vars),
                    new QueryVariablesManager());
            })),
        );

        it('should create',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                const object = {};
                const result = this.expectNotConfiguredOrEqual(expectedCreate, (vars) => service.create(vars), object);

                // if the query is configured, then the result must be merged into the original object
                if (result) {
                    let actual = null;
                    result.subscribe(v => actual = v);
                    expect(Object.keys(object).length).toBeGreaterThan(0);
                }
            })),
        );

        it('should not create with observable',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                tick();
                expect(() => service.create(new BehaviorSubject({}) as any).subscribe()).toThrowError(error);
            })),
        );

        it('should update immediately', fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqual(expectedUpdate, (vars) => service.updateNow(vars), {id: 123});
            })),
        );

        it('should not update with observable',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                tick();
                expect(() => service.update(new BehaviorSubject({id: 123}) as any).subscribe()).toThrowError(error);
            })),
        );

        it('should delete one object',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqual(expectedDelete, (vars) => service.delete(vars), {id: 123});
            })),
        );

        it('should delete several objects at once',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqual(expectedDelete, (vars) => service.delete(vars), [{id: 123}, {id: 456}]);
            })),
        );

        it('should not delete with observable',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                tick();
                expect(() => service.delete(new BehaviorSubject({id: 123}) as any).subscribe()).toThrowError(error);
            })),
        );

        it('should resolve to model and optional enums',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                this.expectNotConfiguredOrEqual(expectedResolve, (id) => service.resolve(id), '123');
            })),
        );

        it('should not create or update with observable',
            fakeAsync(inject([serviceClass], (service: ModelService) => {
                tick();
                expect(() => service.createOrUpdate(new BehaviorSubject({id: 123}) as any).subscribe()).toThrowError(error);
            })),
        );

        it('should create or update',
            fakeAsync(inject([serviceClass], (service: ModelService) => {

                if (!expectedCreate || !expectedUpdate) {
                    expect(() => service.createOrUpdate({}).subscribe()).toThrowError(this.notConfiguredMessage);
                    return;
                }

                const object: Literal = {};

                // Create, should receive temporary id immediately
                service.createOrUpdate(object, true).subscribe();
                expect(object).toEqual({creatingId: 2});

                // After create, should be usual object after creation
                tick();
                expect(object.creatingId).toBeUndefined();
                expect(object.id).toEqual('456');
                const keysAfterCreation = Object.keys(object).length;

                // Create or update again
                service.createOrUpdate(object, true).subscribe();
                expect(Object.keys(object).length).toBe(keysAfterCreation); // not yet updated

                tick();
                expect(Object.keys(object).length).toBeGreaterThan(keysAfterCreation); // should show created + updated objects merged
            })),
        );
    }
}
