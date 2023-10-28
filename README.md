# LaTeX PDF Generator

This is a project to create an API endpoint to which someone can send a latex file and receive the generated pdf back.

## To Deploy

```bash
fly deploy
```

# Generating the PDF

Currently the endpoint is at `https://latex-pdf-generator.fly.dev`; send a post request with the body

```js
{
	string: <The string of the file you want to send>
}
```

The response will be the base64 encoded pdf.
