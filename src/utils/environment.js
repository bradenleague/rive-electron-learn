/**
 * Utility to detect the current runtime environment
 */

// Check if running in Electron
export const isElectron = () => {
  return window && window.process && window.process.type ||
         window && window.electron ||
         navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
};

// Safe access to Electron APIs
export const getElectronAPI = () => {
  if (isElectron() && window.electron) {
    return window.electron;
  }
  return null;
}; 