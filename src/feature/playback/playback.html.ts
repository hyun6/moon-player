import { convertFileSrc } from "@tauri-apps/api/tauri";
import { IPlaybackModule } from "./playback.interface";
import { PlaybackModuleState } from "./playback.model";
import { proxyPlaybackState } from "./playback.store";

const logger = console.log;

export class HtmlPlaybackModule implements IPlaybackModule {
  private _playbackModule: HTMLAudioElement = new Audio();

  constructor() {
    this._initPlaybackEventListener();
  }

  private _initPlaybackEventListener(): void {
    this._playbackModule.addEventListener("timeupdate", () => {
      // this._eventBus?.emitEventTimeUpdated({
      //   currentTime: this._playbackModule.currentTime,
      // });
      proxyPlaybackState.currentTime = this._playbackModule.currentTime;
    });

    this._playbackModule.addEventListener("canplay", () => {
      logger("event:canplay");
      // this._eventBus?.emitEventStatusChanged({
      //   status: PlaybackStatus.Prepared,
      // });
      proxyPlaybackState.state = PlaybackModuleState.Prepared;
      proxyPlaybackState.durationTime = this._playbackModule.duration;
    });

    this._playbackModule.addEventListener("play", () => {
      logger("event:play");
      // this._eventBus?.emitEventStatusChanged({
      //   status: PlaybackStatus.Started,
      // });
      proxyPlaybackState.state = PlaybackModuleState.Started;
    });

    this._playbackModule.addEventListener("pause", () => {
      logger("event:pause");
      // this._eventBus?.emitEventStatusChanged({
      //   status: PlaybackStatus.Paused,
      // });
      proxyPlaybackState.state = PlaybackModuleState.Paused;
    });

    this._playbackModule.addEventListener("ended", () => {
      logger("event:ended");
      // this._eventBus?.emitEventStatusChanged({
      //   status: PlaybackStatus.End,
      // });
      proxyPlaybackState.state = PlaybackModuleState.End;
    });

    this._playbackModule.addEventListener("volumechange", () => {
      // TODO: volume 상태 update
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

  play(progressMs?: number | undefined): void {
    logger("play");
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

  seek(progressMs: number): void {
    this._playbackModule.fastSeek(progressMs);
  }

  volume(percentage: number): void {
    // TODO: 주석에 volume level로 되어있음, percentage로 변환 방식 확인 필요
    this._playbackModule.volume = percentage;
    if (percentage !== 0) {
      this._playbackModule.muted = false;
    }
  }

  mute(): void {
    this._playbackModule.muted = true;
  }

  getDuration(): number {
    return this._playbackModule.duration;
  }
}
