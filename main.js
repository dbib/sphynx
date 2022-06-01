const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 350,
        height: 420,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname + '/icons/logo.png')
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})


// Quit the app when there is no window open (work only on Linux and Windows)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Managing windows for macos, if the app was running on the background
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})