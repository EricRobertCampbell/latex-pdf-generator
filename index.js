const express = require("express");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
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
			console.log(base64String);
			console.log("success");
		} catch (e) {
			console.error("Error getting the pdf file contents");
			console.error(e);
			throw e;
		}
		res.status(200).send(base64String);
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
