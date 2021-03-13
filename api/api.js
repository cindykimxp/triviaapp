// import database connection
// need express router

// features: trivia by category or trivia from all categories
// standard:
// have a round of N questions
// each questions has a time limit e.g. 30 seconds
// score: total_correct/N (maybe take time into account, so faster answers are rewarded)

// burst: answer as many questions in time limit, e.g. 1 minute
// score: total_correct

// start new session
// creates a new session ID

// get a question
// parameters: category
// returns a random question in <category>
// if category is not given, select from all categories
// returns: {question, question_id}

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