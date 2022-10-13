import { proxy } from "valtio";
import { PlaybackModuleState, PlaybackState } from "./playback.model";

/** 상태 초기 값 */
const initState = {
  state: PlaybackModuleState.Idle,
  isPlaying: false,
  isShuffle: false,
  currentTime: 0,
  durationTime: 0,
};

export const proxyPlaybackState = proxy<PlaybackState>(initState);
