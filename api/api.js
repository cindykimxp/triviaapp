// import database connection
let express = require("express");
let mongo = require("mongoose");

// features: trivia by category or trivia from all categories
// standard:
// have a round of N questions
// each questions has a time limit e.g. 30 seconds
// score: total_correct/N (maybe take time into account, so faster answers are rewarded)

// burst: answer as many questions in time limit, e.g. 1 minute
// score: total_correct

// start new session
// creates a new session ID

mongo.model("question", new mongo.Schema({
	text: String,
	answers: [String],
	//indices into the answers array
	correct_answers: [Number],
	categories: [String]
}));
let Question = mongo.model("question");

/*
question metadata:
- reply id
- start time (sec since epoch)
- time limit (sec)
*/

// get a question
// parameters: category
// returns a random question in <category>
// if category is not given, select from all categories
// returns: {question, question_id}
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

// get multiple questions
// parameters: category, number
// returns <number> questions from <category>
// if category is not given, select from all categories
// returns: [{question, question_id}]


// answer question
// parameters: question_id, time_taken
// stores score in database connected with this session ID
// returns boolean

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
	get_question
};
