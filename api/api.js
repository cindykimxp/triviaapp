// import database connection
let route = require("express").Router();
// let mongo = require("mongoose");
let database = import('../database/database')
let utilities = import('../util/utilities')
// features: trivia by category or trivia from all categories
// standard:
// have a round of N questions
// each questions has a time limit e.g. 30 seconds
// score: total_correct/N (maybe take time into account, so faster answers are rewarded)

// burst: answer as many questions in time limit, e.g. 1 minute
// score: total_correct



// mongo.model("question", new mongo.Schema({
// 	text: String,
// 	answers: [String],
// 	//indices into the answers array
// 	correct_answers: [Number],
// 	categories: [String]
// }));
// let Question = mongo.model("question");

/*
question metadata:
- reply id
- start time (sec since epoch)
- time limit (sec)
*/
let get_question = async (category, db) => {
	let query = {};
	if (category !== undefined){
		query = {
			categories: {
				$elemMatch: {$eq: category}
			}
		};
	}

	let ret = await Question.find(query).exec();

	if (!ret.length){
		throw `No questions in category ${category}`;
	}

	return ret[Math.floor(ret.length * Math.random())];
};
let getQuestions = async (n, category=undefined) => {
	try {
		questions = await database.getAllQuestions();
		utilities.shuffleArray(questions);
		let returned_questions = []
		n = Math.min(questions.length, n)
		for (let i = 0; i < n; i++) {
			returned_questions.push(question[i])
		}
		return Promise.resolve(returned_questions)
	}
	catch (error) {
		return Promise.reject(error)
	}
}
const getSingleQuestion = (category=undefined) => {
	return getQuestions(1, category)
}
const getQuestionById = (id) => {
	return database.getQuestionById(id)
}
const getAnswer = (question_id) => {
	return getSingleQuestion()
}
// get a question
// parameters: category
// returns a random question in <category>
// if category is not given, select from all categories
// returns: {question, question_id}
route.get('/question/:category', async (request, response) => {
	let category = request.params.category ? request.params.category : null
	try {
		let question = await getSingleQuestion(category)
		return response.json({question})
	}
	catch(error) {
		return response.json({error})
	}
})
// get multiple questions
// parameters: category, number
// returns <number> questions from <category>
// if category is not given, select from all categories
// returns: [{question, question_id}]
route.get('/questions/:number/:category', async (request, response) => {
	let category = request.params.category ? request.params.category : null
	let number = request.params.number ? request.params.number : 10
	try {
		let questions = await getQuestions(number , category)
		return response.json({questions})
	}
	catch(error) {
		return response.json({error})
	}
})


// answer question
// parameters: question_id, 
// body: user_answer, time_taken (in ms since epoch)
// stores score in database connected with this session ID
// returns boolean
route.post('/answer/:question_id', (request, response) => {
	if (!request.params.question_id) {
		return response.status(400)
	}
	let {question_id} = request.params
	let {user_answer, time_taken} = request.body
	try {
		let question = await getQuestionById(question_id)
		if (question.correct_answer === user_index) {
			// TODO add data to database for this user
		}
		return response.json({result : question.correct_answer === user_index})
	}
	catch (error) {
		return response.json({error})
	}
})
// leaderboard
// parameters: category, limit
// returns top <limit> scores in <category>
// if category is not given then it returns top scores from all categories
// returns {category, [{name, id, score, time}]}

// leaderboard relative to your place
// returns an array of scores of the surrounding 5 relative to your spot in <category>
// parameters: category, id
// returns {category}

module.exports = {
	route,
	get_question
};
