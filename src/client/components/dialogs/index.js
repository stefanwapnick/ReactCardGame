import _ from "lodash";

// This will cause webpack to package all javascript files in the current directory
const context = require.context("./", false, /\.js$/);

// Find modules excluding index (this file)
const components = context
    .keys()
    .filter(name => name.indexOf("index") === -1)
    .map(name => context(name).default);

export default _.zipObject(components.map(c => c.id), components.map(c => c.component));



