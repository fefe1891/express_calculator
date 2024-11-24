const { mean, median, mode } = require("./operations");

test('Calculate mean', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
    expect(mean([1, 2, 3])).toBeCloseTo(2, 5);
});

test('Calculate median', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
});

test('Calculate mode', () => {
    expect(mode([1, 2, 2, 3, 4])).toBe(2);
    expect(mode([1, 1, 2, 2])).toBe(1);
});