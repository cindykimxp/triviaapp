// const { getAnswerById } = require("../database/database");
const TOTAL_NUM_QUESTIONS = 15
const TOTAL_BURST_TIME = 60
// import database connection
let route = require("express").Router();
// let mongo = require("mongoose");
const database = require('../database/database.js');

const utilities = require('../util/utilities.js');
// features: trivia by category or trivia from all categories
// standard:
// have a round of N questions
// each questions has a time limit e.g. 30 seconds
// score: total_correct/N (maybe take time into account, so faster answers are rewarded)

// burst: answer as many questions in time limit, e.g. 1 minute
// score: total_correct/total_time

let getQuestions = async (n, category=null) => {
	try {
		questions = await database.getAllQuestions(category);
		utilities.shuffleArray(questions);
		let returned_questions = []
		n = Math.min(questions.length, n)
		for (let i = 0; i < n; i++) {
			returned_questions.push(questions[i])
		}
		return Promise.resolve(returned_questions)
	}
	catch (error) {
		return Promise.reject(error)
	}
}
const getSingleQuestion = (category=null) => {
	return getQuestions(1, category)
}
const getQuestionById = (id) => {
	return database.getQuestionById(id)
}
const getAnswer = (question_id) => {
	return getSingleQuestion()
}
// returns 3 random answers in the same category
const getRandomAnswers = async (correct_answer_id, category=null) => {
	try {
		let answers
		// console.log('id: ', correct_answer_id)
		if (category) {
			answers = await database.getAllAnswersByCategoryExcludeID(correct_answer_id, category)
		}
		else {
			answers = await database.getAllAnswersExcludeID(correct_answer_id)
		}
		// console.log('answers: ', answers)
		utilities.shuffleArray(answers)
		let returned_answers = []
		n = Math.min(answers.length, 3)
		for (let i = 0; i < n; i++) {
			returned_answers.push(answers[i])
			console.log('false answer is ', answers[i])
		}
		
		return Promise.resolve(returned_answers)
	}
	catch(error) {

		console.log(error)
		return Promise.reject(error)
	}
}
const packQuestionsWithAnswers = async (questions, category) => {
	// console.log('in pack questions')
	try {
		let new_questions = []
		for(let i = 0; i < questions.length; i++) {
			let question = questions[i]
			let new_q = Object.assign({}, question)
			let answer_choices = await getRandomAnswers(question.answer, category)
			let correct_answer = (await database.getAnswerById(question.answer))[0]
			answer_choices.push(correct_answer)
			utilities.shuffleArray(answer_choices)
			new_q['answer_choices'] = answer_choices
			console.log('question: ', new_q)
			new_questions.push(new_q)
		}
		console.log('new questions', new_questions)
		return Promise.resolve(new_questions)
	}
	catch (error) {
		return Promise.reject(error)
	}
}
// get a question
// parameters: category
// returns a random question in <category> with 3 random answers and 1 correct answer
// if category is not given, select from all categories
// returns: {question, question_id}
route.use((req, res, next) => {
	if (!req.session.TOTAL_NUM_QUESTIONS) {
		req.session.TOTAL_NUM_QUESTIONS = TOTAL_NUM_QUESTIONS
	}
	if (!req.session.TOTAL_BURST_TIME) {
		req.session.TOTAL_BURST_TIME = TOTAL_BURST_TIME
	}
	next()
})
route.get('/question/:category?', async (request, response) => {
	console.log('got a request for a question')
	let category = request.params.category ? request.params.category : null
	try {
		let question = (await getSingleQuestion(category))[0]
		// console.log(question)
		let q = await packQuestionsWithAnswers([question], category)
		console.log('returned object: ', q)
		return response.json({"question" : q[0]})
	}
	catch(error) {
		console.log(error)
		return response.json({error})
	}
})
// get multiple questions
// parameters: category, number
// returns <number> questions from <category>
// if category is not given, select from all categories
// returns: [{question, question_id, category, possible_answers : [answer]}]
//questions/sports/10
route.get('/questions/:number?/:category?', async (request, response) => {
	let category = request.params.category ? request.params.category.toUpperCase() : null
	let number = request.params.number ? request.params.number : request.session.TOTAL_NUM_QUESTIONS
	try {
		let questions = await getQuestions(number, category)
		let q = await packQuestionsWithAnswers(questions, category)
		return response.json({questions : q})
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
route.post('/answer/:question_id', async (request, response) => {
	console.log('got an answer request')
	if (!(request.params.question_id && request.body.user_answer_id && request.body.time_taken)) {
		return response.sendStatus(400)
	}
	let question_id = parseInt(request.params.question_id)
	let time_taken = parseInt(request.body.time_taken)
	let user_answer_id = parseInt(request.body.user_answer_id)

	try {
		let question = (await getQuestionById(question_id))[0]
		console.log(typeof question.answer, typeof user_answer_id)
		if (question.answer === user_answer_id) {
			request.session.num_correct ? request.session.num_correct + 1 : 1
			// TODO add data to session for this user
		}
		request.session.total_questions_attempts += 1
		return response.json({result : question.answer === user_answer_id})
	}
	catch (error) {
		console.log(error)
		return response.json({error})
	}
})
//start sessions:
// standard
// burst
route.post('/start/:mode/:category?', async (request, response) => {
	console.log('got a start session')
	try {
		request.session.mode = request.params.mode
		request.session.category = request.params.category ? request.params.category : undefined
		request.session.total_time = 0;
		request.session.total_questions_attempts = 0
		request.session.num_correct = 0
		request.final_score = 0
		return response.sendStatus(200)
	}
	catch (error) {
		return response.json({error})
	}
})
//end sessions: 
// standard  
// burst
route.post('/end/:mode', async (request, response) => {
	console.log('got an end session')
	try {
		if (request.session.mode != request.params.mode) {
			return response.json({"error" : 'ending a session that you did not start'}).status(400)
		}
		let score;
		if (request.session.mode == 'burst') {
			score = (request.session.num_correct / request.session.TOTAL_BURST_TIME) * 100
			request.session.final_score = score
			await database.insertBurstScore(request.session.id, score, request.session.category)
		}
		else {
			score = ((request.session.num_correct*request.session.num_correct *1000) / request.session.TOTAL_NUM_QUESTIONS * request.session.TOTAL_NUM_QUESTIONS * request.session.total_time)
			request.session.final_score = score
			await database.insertStandardScore(request.session.id, score, request.session.category)
		}
		delete request.session.mode
		delete request.session.total_time
		delete request.session.total_questions_attempts
		delete request.session.num_correct
		return response.sendStatus(200)
	}
	catch (error) {
		return response.json({error}).status(400)
	}
})

// leaderboard
// parameters: category, limit
// returns top <limit> scores in <category>
// if category is not given then it returns top scores from all categories
// returns {category, [{name, id, score, time}]}
route.get('/leaderboard/:mode/:category?', async (request, response) => {
	let limit = request.query.limit ? request.query.limit : 10
	try {
		let rows
		let category
		if (request.params.mode === 'burst') {
			// get burst scores
			if (request.params.category) {
				category = request.params.category.toUpperCase()
				// get scores by category
				rows = await database.getAllBurstScoresByCategory(limit, category)

			}
			else {
				// get all scores
				rows = await database.getAllBurstScores(limit)
			}
		}
		else {
			// get standard scores
			if (request.params.category) {
				category = request.params.category.toUpperCase()
				// get scores by category
				rows = await database.getAllStandardScoresByCategory(limit, category)

			}
			else {
				// get all scores
				rows = await database.getAllStandardScores(limit)
			}

		}
		console.log(rows)
		return response.json({board : rows})
	}
	catch (error) {
		return response.json({error}).status(400)
	}
})
// leaderboard relative to your place
// returns an array of scores of the surrounding 5 relative to your spot in <category>
// parameters: category, id
// returns {category}
// export default route
module.exports = route