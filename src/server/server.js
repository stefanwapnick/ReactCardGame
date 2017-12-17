import {CardDatabase} from "./models/card";
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const socketIo = require("socket.io");

// Note that we can also use ES6 style import even though not natively supported by node
// If you look in build folder you will see that Babel will transpile this to require version
import {isDevelopment} from "./settings";
import {Client} from "./models/client";
import {Application} from "./models/application";

// Setup
// -------------------------------------------------------
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

// Configuration
// -------------------------------------------------------
// Use pug as view engine
app.set("view engine", "pug");

// Set view folder
app.set("views", "./views");

// Tell express to serve files static files under public
app.use(express.static("public"));
// -------------------------------------------------------

const useExternalStyles = !isDevelopment;
const scriptRoot = isDevelopment ? "http://localhost:8080/build" : "/build";

// If you request any path that is not in file system,
// Then serve index view
app.get("*", function(request, response){
    response.render("index", { useExternalStyles, scriptRoot});
});


// -------------------------------------------------------
// Services
const cards = new CardDatabase();
const setsPath = path.join(global.appRoute, "data", "sets");
for(let file of fs.readdirSync(setsPath)){
    const setId = path.parse(file).name;
    const setPath = path.join(setsPath, file);
    cards.addSet(setId, JSON.parse(fs.readFileSync(setPath, "utf-8")));
}

const cardsApp = new Application(cards);

// -------------------------------------------------------
// Socket IO (triggered whenever new socket io connection occurs
io.on("connection", socket => new Client(socket, cardsApp));

// -------------------------------------------------------
// Startup
const port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log(`Started http server on ${port}`);
});