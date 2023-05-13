import { describe, expect, test } from '@jest/globals';
import { OutputRounder } from './OutputFormatter';


describe('Output formatter', () => {
    test('Builds a network of given size', () => {

        const tests: number[][][] = [
            [[.1], [0]],
            [[.45], [0]],
            [[.5], [1]],
            [[.7], [1]],

        ];
        const formatter = new OutputRounder();
        tests.forEach(value => {
            const formatted = formatter.format(value[0]);
            expect(formatted.toString).toBe(value[1].toString);
        });

    })


})