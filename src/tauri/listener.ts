import { EventCallback, listen, UnlistenFn } from "@tauri-apps/api/event";

class TauriListener {
  private _fileDropEventOff?: UnlistenFn;
  private _fileDropHandler?: EventCallback<unknown>;

  constructor() {
    this.init();
  }

  async init() {
    this._fileDropEventOff?.();
    this._fileDropEventOff = await listen("tauri://file-drop", (event) => {
      this._fileDropHandler?.(event);
    });
  }

  onFileDropEvent(handler: (event: unknown) => void) {
    this._fileDropHandler = handler;
  }
}

export const tauriListener = new TauriListener();
