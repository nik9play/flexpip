const { app, BrowserWindow } = require('electron')
  let win
  
  function createWindow () {
    win = new BrowserWindow({ width: 640, height: 360, minWidth: 320, minHeight: 180, frame: false, show: false, backgroundColor: '#15151c', alwaysOnTop: true })
  
    win.once('ready-to-show', () => {
      win.show()
    })
    win.loadFile('index.html')

    //win.webContents.openDevTools()

    win.on('closed', () => {
      win = null
    })
  }

  app.on('ready', createWindow)
  
  // macos shit
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })