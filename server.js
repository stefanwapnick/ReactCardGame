const path = require("path");

require("source-map-support").install();
global.appRoute = path.resolve(__dirname);
require("./build/server");
