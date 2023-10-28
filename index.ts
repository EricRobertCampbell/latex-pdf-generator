import express, { Express, Request, Response } from "express";
//@ts-expect-error
import cors from "cors";
import "dotenv/config";

import { validateToken } from "./src/utility/authentication/functions";
import { handleRequest } from "./src/handlers";

const app: Express = express();
const port = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.post("/", async (req: Request, res: Response) => {
  const authorizationHeader = req.header("Authorization");
  const isTokenValid = await validateToken(authorizationHeader);
  if (!isTokenValid) {
    res
      .status(401)
      .send(`Invalid authorization header ${authorizationHeader} provided.`);
    return;
  }
  if (!req.body.string && !req.body.zip) {
    res
      .status(400)
      .send(
        "Unable to find a valid 'zip' or 'string' attribute in request body",
      );
  }
  const data = handleRequest(req, res);
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
