import { proxy } from "valtio";
import { readBinaryFile } from "@tauri-apps/api/fs";
import musicMetadataBrowser from "music-metadata-browser";

import { IPlaybackModule } from "./playback.interface";
import { PlaybackModuleState, PlaybackState } from "./playback.model";
import { HtmlPlaybackModule } from "./playbackModuleImpl/playback.html";

/** 상태 초기 값 */
const initState = {
  state: PlaybackModuleState.Idle,
  isPlaying: false,
  isShuffle: false,
  currentTime: 0,
  durationTime: 0,
  volume: 30,
};

export const proxyPlaybackState = proxy<PlaybackState>(initState);

class PlaybackService {
  private _state: PlaybackState = initState;
  private _playbackModule: IPlaybackModule;

  constructor(playbackModule: IPlaybackModule) {
    this._playbackModule = playbackModule;
  }

  async open(sourceUrl: string): Promise<boolean> {
    const ok = await this._playbackModule.open(sourceUrl);
    if (ok) {
      const fileByteArray = await readBinaryFile(sourceUrl);
      const metaData = await musicMetadataBrowser.parseReadableStream();
      console.log(metaData);
      return true;
    }
    return false;
  }

  play(msPosition?: number): void {
    this._playbackModule.play(msPosition);
  }

  pause(): void {
    this._playbackModule.pause();
  }

  resume(): void {
    this._playbackModule.resume();
  }

  close(): void {
    this._playbackModule.close();
  }

  seek(msPosition: number): void {
    this._playbackModule.seek(msPosition);
  }

  volume(percentage: number): void {
    this._playbackModule.volume(percentage);
  }

  mute(): void {
    this._playbackModule.mute();
  }

  getDuration(): number {
    return this._playbackModule.getDuration();
  }
}
export const playbackService = new PlaybackService(new HtmlPlaybackModule());
