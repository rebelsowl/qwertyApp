# qwertyApp

Electron applications needs nodejs and npm to run in development stage. When applications have been build it does not have any dependency.


## To Use

```bash
# Go into the repository
cd qwertyApp
# Install dependencies
npm install
# Run the app
npm start
```


## To Build


```bash
# Go into the repository
cd qwertyApp
# Install electron-packager
npm install electron-packager -g
# Build the app
npm electron-packager .
```


#Directory Informations
##/.
- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.
##/views
- `HTML codes of each application page 
##/src
- `Source code of project with designed classes
##/css
- `CSS files for styling



## License

[CC0 1.0 (Public Domain)](LICENSE.md)
