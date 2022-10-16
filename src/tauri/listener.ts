import { listen, UnlistenFn } from "@tauri-apps/api/event";

class TauriListener {
  private _fileDropEventOff?: UnlistenFn;
  private _fileDropHandler?: (filePath: string[]) => void;

  constructor() {
    this.init();
  }

  async init() {
    this._fileDropEventOff?.();
    this._fileDropEventOff = await listen("tauri://file-drop", (event) => {
      console.log("file-drop event: ", event);
      this._fileDropHandler?.(event.payload as string[]);
    });
  }

  onFileDropEvent(handler: (filePath: string[]) => void) {
    this._fileDropHandler = handler;
  }
}

export const tauriListener = new TauriListener();
