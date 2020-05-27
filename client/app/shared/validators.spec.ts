import {xorValidator} from './validators';
import {FormBuilder} from '@angular/forms';

describe('xorValidator', () => {
    const fb = new FormBuilder();
    const emptyForm = fb.group({});

    const invalidForm = fb.group({
        foo: ['foo value'],
        bar: ['bar value'],
        baz: ['baz value'],
    });

    const validForm = fb.group({
        foo: ['foo value'],
        bar: [''],
        baz: ['baz value'],
    });

    const validForm2 = fb.group({
        foo: [''],
        bar: [''],
        baz: ['baz value'],
    });

    const empty = xorValidator('myKey1', []);
    const normal = xorValidator('myKey2', ['foo', 'bar']);

    it('with form without controls is always valid', () => {
        expect(empty(emptyForm)).toBeNull();
        expect(normal(emptyForm)).toBeNull();
    });

    it('with invalid form', () => {
        expect(empty(invalidForm)).toBeNull('empty validator is valid');
        expect(normal(invalidForm)).toEqual({myKey2: ['foo', 'bar']});
    });

    it('with valid form', () => {
        expect(empty(validForm)).toBeNull('empty validator is valid');
        expect(normal(validForm)).toBeNull('valid because only one is set');
        expect(normal(validForm2)).toBeNull('valid because none are set');
    });
});
