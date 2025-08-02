// @ts-check
const fs = require("fs");
const config = require("./config.json");

/** @type {string[]} */
const brokenFiles = [];

if (fs.existsSync("./broken.txt")) {
    brokenFiles.push(...new Set(fs.readFileSync("./broken.txt", "utf-8").split("\n")));
}

const existingBackup = fs.readdirSync(config.recoveryDestinationDirectory);
const originalFiles = fs.readdirSync(config.originalFileDirectory).filter(file => !existingBackup.includes(file) && !brokenFiles.includes(file));

console.log(existingBackup.length)
console.log(originalFiles.length)


async function fileBackup() {
    for (const file of originalFiles) {
        try {
            const filepath = `${config.originalFileDirectory}/${file}`
            const stats = fs.statSync(filepath)
            console.log(`Copying ${file} (${(stats.size / 1024).toFixed(2)} MB)`)

            let timeExpired;
            if ((stats.size / 1024) < 5000) {
                timeExpired = setTimeout(() => {
                    console.log("YOU'RE TAKING TOO LONG!")
                    timeExpired = true;
                    flagAsBroken(file);
                }, config.smallFileTimeout);
            }

            await fs.promises.copyFile(filepath, `${config.recoveryDestinationDirectory}/${file}`);
            if (timeExpired) clearTimeout(timeExpired);
            
        } catch (error) {
            console.log("Failed")
            flagAsBroken(file)
            return true;
        }
    }
}


fileBackup();

function flagAsBroken(file) {
    brokenFiles.push(file);
    fs.writeFileSync("./broken.txt", brokenFiles.join("\n"));
}
