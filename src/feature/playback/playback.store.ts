import { proxy } from "valtio";
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

export const playbackModule: IPlaybackModule = new HtmlPlaybackModule();
