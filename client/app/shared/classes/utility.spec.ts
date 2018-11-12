import { Utility } from '../classes/utility';

describe('Utility', () => {

    it('should transform relations to id and remove __typename, but never touch File instances', () => {
        const file = new File(['foo'], 'foo');
        const input = {
            prop1: 'val1',
            obj1: {
                id: 123,
                prop2: 'val2',
            },
            prop3: {
                prop4: 'val4',
            },
            prop5: {
                prop6: 'val6',
                __typename: 'some type',
            },
            file: file,
        };

        const expected = {
            prop1: 'val1',
            obj1: 123,
            prop3: {
                prop4: 'val4',
            },
            prop5: {
                prop6: 'val6',
            },
            file: file,
        };

        const result = Utility.relationsToIds(input);
        expect(result).toEqual(expected);

        // The original object must not be touched
        expect(input.prop5.__typename).toBe('some type');
    });

    it('should make plural according to english grammar', () => {
        const result1 = Utility.makePlural('action');
        expect(result1).toBe('actions');

        const result2 = Utility.makePlural('taxonomy');
        expect(result2).toBe('taxonomies');

        const result3 = Utility.makePlural('process');
        expect(result3).toBe('processes');
    });

    it('should uppercase first letter', () => {
        const result = Utility.upperCaseFirstLetter('foo bAr');
        expect(result).toBe('Foo bAr');
    });

    it('should lowercase first letter', () => {
        const result = Utility.lowerCaseFirstLetter('FOO BaR');
        expect(result).toBe('fOO BaR');
    });

});
