import express, { Express, Request, Response } from "express";
const cors = require("cors");
const { spawnSync } = require("child_process");
const fs = require("fs");

const baseDir = "/tmp";
const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const doEverything = (fileText: string) => {
	if (!fileText) {
		return;
	}

	fs.writeFileSync(`${baseDir}/main.tex`, fileText);

	const clean = spawnSync("latexmk", ["-C"]);
	const process = spawnSync("latexmk", [
		`${baseDir}/main.tex`,
		"-pdf",
		"--shell-escape",
		`-output-directory=${baseDir}`,
	]);

	// read the file in
	const fileData = fs.readFileSync(`${baseDir}/main.pdf`);
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
app.post("/", (req: Request, res: Response) => {
	const fileString = req.body.string;
	console.log("body:", req.body);
	// console.log("body", req);
	const data = doEverything(fileString);
	console.log("data:", data);
	res.status(200).send(data);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
