import { convertFileSrc } from "@tauri-apps/api/tauri";
import { IPlaybackModule } from "../playback.interface";
import { PlaybackModuleState } from "../playback.model";
import { proxyPlaybackState } from "../playback.store";

const logger = console.log;

export class HtmlPlaybackModule implements IPlaybackModule {
  private _playbackModule: HTMLAudioElement = new Audio();

  constructor() {
    this._initPlaybackEventListener();
  }

  private _initPlaybackEventListener(): void {
    this._playbackModule.addEventListener("timeupdate", () => {
      logger("event:timeupdate");
      proxyPlaybackState.currentTime = this._playbackModule.currentTime;
    });

    this._playbackModule.addEventListener("canplay", () => {
      logger("event:canplay");
      proxyPlaybackState.state = PlaybackModuleState.Prepared;
      proxyPlaybackState.durationTime = this._playbackModule.duration;
    });

    this._playbackModule.addEventListener("play", () => {
      logger("event:play");
      proxyPlaybackState.state = PlaybackModuleState.Started;
      proxyPlaybackState.isPlaying = true;
    });

    this._playbackModule.addEventListener("pause", () => {
      logger("event:pause");
      proxyPlaybackState.state = PlaybackModuleState.Paused;
      proxyPlaybackState.isPlaying = false;
    });

    this._playbackModule.addEventListener("ended", () => {
      logger("event:ended");
      proxyPlaybackState.state = PlaybackModuleState.End;
      proxyPlaybackState.isPlaying = false;
    });

    this._playbackModule.addEventListener("volumechange", () => {
      logger("event:volumeChange");
    });

    this._playbackModule.addEventListener("durationchange", () => {
      logger("event:durationChange");
      proxyPlaybackState.durationTime = this._playbackModule.duration;
    });

    this._playbackModule.addEventListener("currentTime", () => {
      logger("event:durationChange");
      proxyPlaybackState.durationTime = this._playbackModule.duration;
    });
  }

  async open(sourceUrl: string): Promise<boolean> {
    logger("open: ", sourceUrl);
    // const localPath = `C:/Users/kakaoent/Documents/멜론 보관함/받은 파일함/Officialdism-01-Mixed Nuts.mp3`;
    // this._playbackModule.src = localPath;

    // TODO: local file check
    const filePath = convertFileSrc(sourceUrl);
    this._playbackModule.src = filePath;

    logger("open src: ", this._playbackModule.src);
    this._playbackModule.load();
    return true;
  }

  play(msPosition?: number | undefined): void {
    logger("play");
    if (msPosition) {
      this.seek(msPosition);
    }
    this._playbackModule.play();
  }

  pause(): void {
    logger("pause");
    this._playbackModule.pause();
  }

  resume(): void {
    logger("resume");
    this._playbackModule.play();
  }

  close(): void {
    this._playbackModule.pause();
    this._playbackModule.src = "";
  }

  seek(msPosition: number): void {
    logger("seek: ", msPosition);
    // this._playbackModule.fastSeek(msPosition);
    this._playbackModule.currentTime = msPosition;
  }

  volume(percentage: number): void {
    // - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
    // - 0 ~ 1 범위로 설정
    this._playbackModule.volume = percentage / 100;
    this._playbackModule.muted = percentage === 0;
  }

  mute(): void {
    this._playbackModule.muted = true;
  }

  getDuration(): number {
    return this._playbackModule.duration;
  }
}
