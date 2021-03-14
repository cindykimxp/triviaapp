let mongo = require("mongoose");

let api = require("./api.js");

(async () => {

let db = mongo.connect("mongodb://test:password@127.0.0.1/trivia_app", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

test("Check jest works", () => {
	expect(true).toBe(true);
});

test("Retrieve question", async () => {
	expect(
		await api.get_question()
	).toBeDefined();
});

test("Retrieve question of category xxx", async () => {
	expect(
		(await api.get_question("xxx", db))?.categories?.indexOf("xxx")
	).not.toBe(-1);
});

afterAll(() => {
	mongo.disconnect();
});

})();
