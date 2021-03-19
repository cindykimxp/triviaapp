//connect to database here
//export all methods so api can use them
let { Pool } = require('pg');
let pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_USER,
	host: 'localhost',
	database: 'triviaApp',
	port: 5432,
})
const getAllQuestions = async (category) => {
	if (category !== undefined){
		return getAllQuestionsByCategory(category)
	}
    try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question')
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAllQuestionsByCategory = (category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question where category = $1', [category])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
// TODO connect to database and return a question object
const getQuestionById = async (id) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from question where id = $1', [id])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAllAnswers = async () => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer')
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAllAnswersByCategory = async (category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where category = $1', [category])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAnswerById = async (id) => {
	try {
		let client = await pool.connect()
        let results = await client.query('SELECT * from answer where id = $1', [id])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const insertStandardScore = async (id, score, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('insert into standard_score(id, score, category) values ($1, $2, $3) on conflict (id, category)\
		 do update set id = $1, score = $2, category = $3', [id, score, category])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const insertBurstScore = async (id, score, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('insert into burst_score(id, score, category) values ($1, $2, $3) on conflict (id, category)\
		 do update set id = $1, score = $2, category = $3', [id, score, category])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAllStandardScores = async (limit) => {
	try {
		let client = await pool.connect()
		let results = await client.query('select * from standard_score order by score desc limit $1', [limit])
		return Promise.resolve(results.rows)
	}
	catch (error) {
		return Promise.reject(error);
	}
}
const getAllBurstScores = async (limit) => {
	try {
		let client = await pool.connect()
        let results = await client.query('select * from burst_score order by score desc limit $1', [limit])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
const getAllStandardScoresByCategory = async (limit=10, category) => {
	try {
		let client = await pool.connect()
		let results = await client.query('select * from standard_score where category = $1 order by score desc limit $2', [category, limit])
		return Promise.resolve(results.rows)
	}
	catch (error) {
		return Promise.reject(error);
	}
}
const getAllBurstScoresByCategory = async (limit=10, category) => {
	try {
		let client = await pool.connect()
        let results = await client.query('select * from burst_score where category = $1 order by score desc limit $2', [category, limit])
        return Promise.resolve(results.rows)
    }
    catch (error) {
        return Promise.reject(error);
    }
}
module.exports = {
	pool,
    getAllQuestions,
	getAllQuestionsByCategory,
	getQuestionById,
	getAllAnswers,
	getAllAnswersByCategory,
	getAnswerById,
	insertStandardScore,
	insertBurstScore,
	getAllStandardScores,
	getAllBurstScores,
	getAllStandardScoresByCategory,
	getAllBurstScoresByCategory
}