import http from 'http'
import path from 'path'
import url from 'url'
import fs from 'fs'

// check for arguments
if (process.argv.length < 3) {
    // user must specify entry html page
    console.log(`\nUsage: \n\t$ node gamebutler.js path/to/index.html\n`)
    process.exit()
}

// store const entrypoint
const ENTRY = path.resolve(process.argv[2])
const BASE  = path.dirname(ENTRY)
const PORT  = 8080

// create server
let server = http.createServer((request, response) => {
    let uri = url.parse(request.url).pathname.replace("%20", " ")
    let filename = path.join(BASE, uri)
    fs.stat(filename, (err, status) => {
	if (err != null) {
	    response.writeHead(200, {'Content-Type': 'text/plain'})
            response.write('404')
	    response.end()
	} else {
	    // if we are on the root directory, serve entrypoint
	    if (status.isDirectory()) {
		filename = ENTRY
	    }
	    // get file extension
	    let ext = path.extname(filename).split(".")[1]
	    let mimeType = ""
	    switch (ext) {
		case "html":
		mimeType = "text/html"
		break
		case "jpg":
		case "jpeg":
		mimeType = "image/jpeg"
		break
		case "png":
		mimeType ="image/png"
		break
		case "js":
		mimeType ="text/javascript"
		break
		case "css":
		mimeType ="text/css"
		break	
	    }
	    response.writeHead(200, {'Content-Type': mimeType});
	    let fileStream = fs.createReadStream(filename)
            fileStream.pipe(response)
	    
	    console.log("- %s", filename)
	}
    })
}).listen(PORT, () => {
    console.log("GameButler listening on: http://localhost:%s", PORT)
})


