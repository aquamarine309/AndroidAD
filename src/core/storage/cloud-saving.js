
export const Cloud = {
  provider: null,
  auth: null,
  db: null,
  user: null,
  lastCloudHash: null,

  get isAvailable() {
    return false;
  },

  resetTempState() {
    this.lastCloudHash = null;
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();
  },

  get loggedIn() {
    return this.user !== null;
  },
  
  init() {}
};
