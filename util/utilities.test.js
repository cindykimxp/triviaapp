let {shuffleArray} = require('./utilities')
test('shuffles array', () => {
    let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(shuffleArray(a)).not.toEqual(b)
})