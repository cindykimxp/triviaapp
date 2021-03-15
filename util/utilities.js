let shuffleArray = (array) => {
    let n = array.length
    for (let i = 0; i < n; i++) {
        let q = Math.floor(Math.random() * n)
        let temp = array[q];
        array[q] = array[i]
        array[i] = temp
    }
    return array
}
module.exports = {
    shuffleArray
}