const express = require("express");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());

const doEverything = (fileText, cb) => {
	if (!fileText) {
		return;
	}

	fs.writeFileSync("/tmp/main.tex", fileText);

	const clean = spawnSync("latexmk", ["-C"]);
	const process = spawnSync("latexmk", [
		"/tmp/main.tex",
		"-pdf",
		"--shell-escape",
		"-output-directory=/tmp/",
	]);

	// read the file in
	fs.readFile("/tmp/main.pdf", (err, data) => {
		if (err) {
			return;
			// res.status(500).send(`Error: ${err}`);
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
		cb(base64String);
	});
};
app.post("/", (req, res) => {
	const fileString = req.body.string;
	// console.log("body", req);
	doEverything(fileString, (data) => res.status(200).send(data));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
