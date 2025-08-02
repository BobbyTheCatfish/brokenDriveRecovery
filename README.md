# brokenDriveRecovery

I have an SD card with some issues. When reading certain files, the drive becomes unresponsive and unmounts.
This tool aims to copy all the files it can from the drive, and builds a list of unrecoverable files.

## Usage
1) Copy `config-example.json` to `config.json` and change the path values. Absolute paths are ideal.
2) Run `node recover.js`
3) When prompted, re-run the command in step 2.

If the program becomes unresponsive, you may have to stop the script, and unplug the drive and plug it back in.