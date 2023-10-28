import { Request, Response } from "express";
import { spawnSync } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const BASE_DIR = "./tmp";

export const handleRequest = (req: Request, res: Response) => {
	console.log(`Beginning request processing`);
	const workDir = setupProject();

	let pdfData;
	try {
		if (req.body?.string) {
			pdfData = handleStringRequest(workDir, req.body?.string);
		} else if (req.body?.zip) {
			pdfData = handleZipRequest(workDir, req.body?.zip);
		}
	} finally {
		// delete the file that you just created
		fs.rmSync(workDir, {
			recursive: true,
			force: true,
		});
	}

	console.log(`Done with request`);
	return pdfData;
};

const setupProject = () => {
	const uniqueRequestId = uuidv4();
	const requestDir = `${BASE_DIR}/${uniqueRequestId}`;
	fs.mkdirSync(requestDir, { recursive: true });
	console.log(`Done creating working directory in ${uniqueRequestId}`);
	return requestDir;
};

export const handleStringRequest = (workDir: string, fileString: string) => {
	if (!fileString) {
		return;
	}

	const mainFile = `${workDir}/main.tex`;
	fs.writeFileSync(mainFile, fileString);

	const process = spawnSync("latexmk", [
		mainFile,
		"-pdf",
		"--shell-escape",
		`-output-directory=${workDir}`,
	]);

	// read the file in
	const fileData = fs.readFileSync(`${workDir}/main.pdf`);
	let base64String;
	try {
		base64String = fileData.toString("base64");
	} catch (e) {
		console.error("Error getting the pdf file contents");
		console.error(e);
		throw e;
	}
	return base64String;
};

export const handleZipRequest = (workDir: string, zipFileData: string) => {
	if (!zipFileData) {
		return;
	}

	// unpack the zipfile
	const zipFile = `${workDir}/main.zip`;
	const zipBinary = Buffer.from(zipFileData, "base64");
	fs.writeFileSync(zipFile, zipBinary);
	const unzip = spawnSync(`unzip`, [zipFile, "-d", workDir]);

	const mainFile = `${workDir}/main.tex`;
	if (!fs.existsSync(mainFile)) {
		throw new Error(
			"Provided zip file does not have a main.tex; aborting."
		);
	}

	const process = spawnSync("latexmk", [
		mainFile,
		"-pdf",
		"--shell-escape",
		`-output-directory=${workDir}`,
	]);

	// read the file in
	const fileData = fs.readFileSync(`${workDir}/main.pdf`);
	let base64String;
	try {
		base64String = fileData.toString("base64");
	} catch (e) {
		console.error("Error getting the pdf file contents");
		console.error(e);
		throw e;
	}
	return base64String;
};
