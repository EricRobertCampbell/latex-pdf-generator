const express = require("express");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
	console.log("req:", req);
	const fileString = req.body.string;
	if (!fileString) {
		res.status(500).send(
			`Error: no "string" in body: ${JSON.parse(req.body)}`
		);
	}

	fs.writeFileSync("main.tex", fileString);

	const clean = spawnSync("latexmk", ["-c"]);
	const process = spawnSync("latexmk", ["-pdf", "--shell-escape"]);

	// read the file in
	fs.readFile("main.pdf", (err, data) => {
		if (err) {
			res.status(500).send(`Error: ${err}`);
		}
		console.log(`got pdf data`, data);
		let base64String;
		try {
			base64String = data.toString("base64");
			// console.log(base64String);
			console.log("success");
		} catch (e) {
			console.error("Error getting the pdf file contents");
			console.error(e);
			throw e;
		}
		res.status(200).send(base64String);
	});
	res.status(200).send(req.body);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
