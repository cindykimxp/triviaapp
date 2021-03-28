const database = require('./database/database.js');

const main = () => {
    database.getAllQuestions('ENTERTAINMENT').then((data) => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
}
main()