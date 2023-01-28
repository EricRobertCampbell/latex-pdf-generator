const express = require("express");
const { spawnSync } = require("child_process");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());

const doEverything = (fileText) => {
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
	const fileData = fs.readFileSync("/tmp/main.pdf");
	console.log(`got pdf data`, fileData);
	let base64String;
	try {
		base64String = fileData.toString("base64");
		// console.log(base64String);
		console.log("success");
	} catch (e) {
		console.error("Error getting the pdf file contents");
		console.error(e);
		throw e;
	}

	return base64String;
};
app.post("/", (req, res) => {
	const fileString = req.body.string;
	// console.log("body", req);
	const data = doEverything(fileString);
	console.log("data:", data);
	res.status(200).send(data);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
