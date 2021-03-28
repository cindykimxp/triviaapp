let database = require('./database.js')
test('functions are defined', () => {
    expect(database.getAllQuestions).toBeDefined()
})
test('functions returns something', async () => {
    expect(await database.getAllQuestions()).toBeDefined()
})
test('functions returns something', async () => {
    console.log(await database.getAllQuestions('ENTERTAINMENT'))
    expect(await database.getAllQuestions('ENTERTAINMENT')).toBeDefined()
})
// test('functions are defined', () => {
//     expect(database.getAllQuestionsByCategory).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getQuestionById).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllAnswers).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllAnswersExcludeID).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllAnswersByCategory).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllAnswersByCategoryExcludeID).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAnswerById).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.insertStandardScore).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.insertBurstScore).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllStandardScores).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllBurstScores).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllStandardScoresByCategory).toBeDefined()
// })
// test('functions are defined', () => {
//     expect(database.getAllBurstScoresByCategory).toBeDefined()
// })