import { readBinaryFile } from "@tauri-apps/api/fs";
import * as musicMetadataBrowser from "music-metadata-browser";

import { IPlaybackModule } from "./playback.interface";
import { HtmlPlaybackModule } from "./playbackModuleImpl/playback.html";
import { IAudioMetadata } from "music-metadata-browser";
import { playbackStore } from "./playback.store";
import { TrackId } from "../track/track.model";
import { selectTrackById } from "../playlist/playlist.store";

// proxy state를 class 내부에 두려고 했으나
// state 변경 시 에러 발생 등의 이유로 state와 class(actions)로 분리
// - https://github.com/pmndrs/valtio/wiki/How-to-organize-actions
class PlaybackService {
  private _playbackModule: IPlaybackModule;
  private _audioMetaData?: IAudioMetadata;

  constructor(playbackModule: IPlaybackModule) {
    this._playbackModule = playbackModule;
  }

  async open(trackId: TrackId): Promise<boolean> {
    const track = selectTrackById(trackId);
    if (track === undefined) {
      return false;
    }
    const ok = await this._playbackModule.open(track.source);
    if (ok) {
      // 약 5초 소요되는 듯...
      // rust로 메타 데이터 파싱 로직을 옮기고 성능 비교 필요
      const readStart = performance.now();
      const fileByteArray = await readBinaryFile(track.source);
      const readEnd = performance.now(); // 약 10초 소요
      console.log("readFile: ", readEnd - readStart);

      const parseStart = performance.now();
      this._audioMetaData = await musicMetadataBrowser.parseBlob(
        new Blob([fileByteArray])
      );
      const parseEnd = performance.now(); // 약 30ms 소요
      console.log("parseFile: ", parseEnd - parseStart);
      console.log(this._audioMetaData);

      // metadata to playingTrack
      track.name = this._audioMetaData.common.title ?? track.source;
      const coverImg = musicMetadataBrowser.selectCover(
        this._audioMetaData.common.picture
      );
      track.album = {
        id: "",
        name: this._audioMetaData.common.album ?? "",
        coverImg: coverImg ?? undefined,
        //coverImg: coverImg ? new Blob([coverImg.data]) : undefined, // Blob to img src not working
      };
      track.artist = this._audioMetaData.common.artist ?? "";
      playbackStore.playingTrack = track;

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
