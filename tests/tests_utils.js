import {getDiff} from '../utils';

describe('UploadCategoryBiglCriteria.utils.getDiff', () => {
    const CASES = [
        [
            {a: 1}, null,
            {all: true}, {all: true},
        ],
        [
            {a: 1}, {},
            {all: true}, {}
        ],
        [
            {a: 1}, {a: 1},
            {}, {}
        ],
        [
            {a: 1}, {a: 2},
            {values: {a: {all: true}}}, {values: {a: {all: true}}}
        ],
        [
            {a: 1}, {b: 2},
            {values: {a: {all: true}}}, {values: {b: {all: true}}}
        ],
        [
            {a: 1}, {a: {c: 2}},
            {values: {a: {all: true}}}, {values: {a: {all: true}}}
        ],
        [
            {a: {c: 2}}, {a: {c: 2}},
            {}, {}
        ],
        [
            {a: {b: 2, d: 4}}, {a: {c: 2}},
            {values: {a: {values: {b: {all: true}, d: {all: true}}}}},
            {values: {a: {values: {c: {all: true}}}}}
        ],
        [
            {a: {b: {d: 4}}}, {a: {b: {}}},
            {values: {a: {values: {b: {all: true}}}}},
            {}
        ],
    ];

    for (let [a, b, result, reverseResult] of CASES) {
        it('('+ JSON.stringify(a) + ', ' + JSON.stringify(b) +')', () => {
            expect(getDiff(a, b)).toEqual(result);
            expect(getDiff(b, a)).toEqual(reverseResult);
        });
    }
});
