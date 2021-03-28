//connect to database here
//export all methods so api can use them
let { Pool } = require('pg');
let env_result = require('dotenv').config();
let pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: 'localhost',
	database: 'triviaapp',
	port: 5432,
})
exports.pool = pool
const getAllQuestions = async (category) => {
	if (category !== null) {
		return getAllQuestionsByCategory(category)
	}
    try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question')
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllQuestions = getAllQuestions
const getAllQuestionsByCategory = async (category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question where category = $1', [category])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllQuestionsByCategory = getAllQuestionsByCategory
// TODO connect to database and return a question object
const getQuestionById = async (id) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question where id = $1', [id])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getQuestionById = getQuestionById
const getAllAnswers = async () => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer')
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllAnswers = getAllAnswers
const getAllAnswersExcludeID = async (id) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where id != $1', [id])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllAnswersExcludeID = getAllAnswersExcludeID
const getAllAnswersByCategory = async (category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where category = $1', [category])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllAnswersByCategory = getAllAnswersByCategory
const getAllAnswersByCategoryExcludeID = async (id, category) => {
    try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where category = $1 and id != $2', [category, id])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllAnswersByCategoryExcludeID = getAllAnswersByCategoryExcludeID
const getAnswerById = async (id) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where id = $1', [id])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAnswerById = getAnswerById
const insertStandardScore = async (id, score, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('insert into standard_score(id, score, category) values ($1, $2, $3) on conflict (id, category)\
		 do update set id = $1, score = $2, category = $3', [id, score, category])
         client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.insertStandardScore = insertStandardScore
const insertBurstScore = async (id, score, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('insert into burst_score(id, score, category) values ($1, $2, $3) on conflict (id, category)\
		 DO UPDATE set id = $1, score = $2, category = $3', [id, score, category])
         client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.insertBurstScore = insertBurstScore
const getAllStandardScores = async (limit=10) => {
	try {
		let client = await pool.connect()
		let results = await client.query('select * from standard_score order by score desc limit $1', [limit])
        client.release()
		return Promise.resolve(results.rows)
	}
	catch (error) {
		return Promise.reject(error);
	}
}
exports.getAllStandardScores = getAllStandardScores
const getAllBurstScores = async (limit=10) => {
	try {
		let client = await pool.connect()
        let results = await client.query('select * from burst_score order by score desc limit $1', [limit])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllBurstScores = getAllBurstScores
const getAllStandardScoresByCategory = async (limit=10, category) => {
	try {
		let client = await pool.connect()
		let results = await client.query('select * from standard_score where category = $1 order by score desc limit $2', [category, limit])
        client.release()
		return Promise.resolve(results.rows)
	}
	catch (error) {
		return Promise.reject(error);
	}
}
exports.getAllStandardScoresByCategory = getAllStandardScoresByCategory
const getAllBurstScoresByCategory = async (limit=10, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('select * from burst_score where category = $1 order by score desc limit $2', [category, limit])
        client.release()
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.getAllBurstScoresByCategory = getAllBurstScoresByCategory
// module.exports = {
// 	pool,
//     getAllQuestions,
// 	getAllQuestionsByCategory,
// 	getQuestionById,
// 	getAllAnswers,
//     getAllAnswersExcludeID,
// 	getAllAnswersByCategory,
//     getAllAnswersByCategoryExcludeID,
// 	getAnswerById,
// 	insertStandardScore,
// 	insertBurstScore,
// 	getAllStandardScores,
// 	getAllBurstScores,
// 	getAllStandardScoresByCategory,
// 	getAllBurstScoresByCategory
// }