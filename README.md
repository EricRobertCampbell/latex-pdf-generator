# LaTeX PDF Generator

This is a project to create an API endpoint to which someone can send a latex file and receive the generated pdf back.

## To Deploy

```bash
npm run build && npm run deploy
```

## Developing Locally

1. Start the docker daemon (run Docker Desktop from windows)
1. Build and start the container

```bash
docker build -t latex-pdf-generator .
docker run -dp 3000:3000 latex-pdf-generator
```

The server should now be running on port 3000.

# Generating the PDF

Currently the endpoint is at `https://latex-pdf-generator.fly.dev`; send a post request with the body

```js
{
	string: <The string of the file you want to send>
}
```

The response will be the base64 encoded pdf.
