#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = "website/";

// https://stackoverflow.com/a/68317228/788168
function copyDirectory(source, destination) {
    fs.mkdirSync(destination, { recursive: true });
    
    fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
        let sourcePath = path.join(source, entry.name);
        let destinationPath = path.join(destination, entry.name);
        
        entry.isDirectory()
        ? copyDirectory(sourcePath, destinationPath)
        : fs.copyFileSync(sourcePath, destinationPath);
    });
}

if (__dirname !== process.cwd()) {
    console.log("Please run this from the root of the repo. cwd: ", process.cwd(), __dirname);
    process.exit(1);
}

console.log("Building production bundle...");
// Live output: https://stackoverflow.com/a/31104898/788168
execSync("NODE_ENV=production npm run bundle", { stdio: 'inherit' });

console.log(`Creating ${OUTPUT_DIR}`);

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

console.log("Copying files...");

copyDirectory("static/", OUTPUT_DIR);
copyDirectory("dist/", OUTPUT_DIR);
const filesToCopy = [
    // "./dist/p5-widget.js",
    // "./dist/p5-widget.js.map",
    // "./dist/preview-frame.bundle.js",
    // "./dist/preview-frame.bundle.js.map",
    // "./dist/main.bundle.js",
    // "./dist/main.bundle.js.map",
    // "./dist/ts.worker.js",
    // "./dist/ts.worker.js.map",
];
filesToCopy.forEach((file) => {
    const fileName = path.basename(file);
    fs.copyFileSync(file, path.join(OUTPUT_DIR, fileName));
});

console.log("Done!");