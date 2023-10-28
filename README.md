# LaTeX PDF Generator

This is a project to create an API endpoint to which someone can send a latex file and receive the generated pdf back.

## To Deploy

```bash
npm run build && npm run deploy
```

## Developing Locally

```bash
npm run dev
```

This will run the server on port 3000 by default.

## Setting the Secrets

To set the appropriate secrets in fly.io

```
fly secrets set ACCEPTED_AUTH_KEY=<the key>
```

# Generating the PDF

Currently the endpoint is at `https://latex-pdf-generator.fly.dev`; send a post request with the body

```js
{
	string: <The string of the file you want to send>
}
```

The response will be the base64 encoded pdf.
