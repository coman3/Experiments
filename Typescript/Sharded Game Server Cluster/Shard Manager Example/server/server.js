const express = require('express')
const path = require("path");

const app = express();
const port = 3000;

module.exports = {
    startServer: (distFolder) => {
        app.use((req, res, next) => {

            //if the request has params, remove them
            var requestPath = req.url;
            if (requestPath.includes("?")) requestPath = requestPath.substring(0, requestPath.lastIndexOf("?"))
            if (requestPath.includes("#")) requestPath = requestPath.substring(0, requestPath.lastIndexOf("#"))

            // if the request has a dot near within the last 6 chars, use static files (this prevents dots further within the path being counted as a file extension)
            if (requestPath.lastIndexOf(".") > requestPath.length - 6)
                return next();
            res.sendFile(path.join(distFolder, "index.html"));
        })
        app.use(express.static(path.join(distFolder)));
        app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
}