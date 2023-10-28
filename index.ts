import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
const cors = require("cors");
const { spawnSync } = require("child_process");
const fs = require("fs");
import "dotenv/config";

import { validateToken } from "./src/utility/authentication/functions";

const baseDir = "./tmp";
const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const doEverything = (fileText: string) => {
	if (!fileText) {
		return;
	}
	const uniqueRequestId = uuidv4();

	const requestDir = `${baseDir}/${uniqueRequestId}`;
	const mainFile = `${requestDir}/main.tex`;
	fs.mkdirSync(requestDir, { recursive: true });
	fs.writeFileSync(mainFile, fileText);

	const clean = spawnSync("latexmk", ["-C"]);
	const process = spawnSync("latexmk", [
		mainFile,
		"-pdf",
		"--shell-escape",
		`-output-directory=${requestDir}`,
	]);

	// read the file in
	const fileData = fs.readFileSync(`${requestDir}/main.pdf`);
	console.log(`got pdf data`, fileData);
	let base64String;
	try {
		base64String = fileData.toString("base64");
		console.log("success");
	} catch (e) {
		console.error("Error getting the pdf file contents");
		console.error(e);
		throw e;
	}

	// delete the file that you just created
	fs.rmSync(requestDir, {
		recursive: true,
		force: true,
	});

	return base64String;
};
app.post("/", async (req: Request, res: Response) => {
	const token = req.body.token;
	const isTokenValid = await validateToken(token);
	if (!isTokenValid) {
		res.status(401).send(`Invalid token ${token} provided.`);
		return;
	}
	const fileString = req.body.string;
	console.log("body:", req.body);
	// console.log("body", req);
	const data = doEverything(fileString);
	// console.log("data:", data);
	res.status(200).send(data);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
