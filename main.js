const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Roaring Lion Brewing Time',
    icon: path.join(__dirname, 'icons', 'icon-512.png'),
  });

  win.loadFile('index.html');
}

// ── IPC: Save file dialog ────────────────────────────────────────────────────
ipcMain.handle('show-save-dialog', async (_event, { defaultPath, filters }) => {
  const result = await dialog.showSaveDialog({ defaultPath, filters });
  return result;
});

// ── IPC: Open file dialog ────────────────────────────────────────────────────
ipcMain.handle('show-open-dialog', async (_event, { filters }) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters,
  });
  return result;
});

// ── IPC: Write file ──────────────────────────────────────────────────────────
ipcMain.handle('write-file', async (_event, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ── IPC: Read file ───────────────────────────────────────────────────────────
ipcMain.handle('read-file', async (_event, { filePath }) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
