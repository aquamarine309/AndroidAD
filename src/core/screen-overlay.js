export const ScreenOverlay = {
  get show() {
    return (this.view.achievementId > 0 || Modal.isOpen);
  },
  get view() {
    return ui.view;
  },
  clear() {
    if (!this.show) return;
    this.view.achievementId = 0;
    EventHub.dispatch(GAME_EVENT.OVERLAY_UPDATE);
  }
}