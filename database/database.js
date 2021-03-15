//connect to database here
//export all methods so api can use them
let mongo = require("mongoose");
mongo.model("question", new mongo.Schema({
	text: String,
	answers: [String],
	//indices into the answers array
	correct_answers: [Number],
	categories: [String]
}));
let Question = mongo.model("question");
let getAllQuestions = async (category, db) => {
	let query = {};
	if (category !== undefined){
		query = {
			categories: {
				$elemMatch: {$eq: category}
			}
		};
	}
    try {
        let results = await Question.find(query).exec();
        if (!results.length) {
            throw `No questions in ${category}`
        }
        return results
    }
    catch (error) {
        throw error;
    }
}
module.exports = {
    getAllQuestions
}