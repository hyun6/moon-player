import { proxy } from "valtio";
import { TrackModel } from "../track/track.model";
import { PlaybackModuleStatus } from "./playback.model";

/** Playback 상태 관리 객체 정의 */
export interface PlaybackStore {
  status: PlaybackModuleStatus;
  playingTrack?: TrackModel;
  isPlaying: boolean;
  isShuffle: boolean;
  currentTime: number;
  durationTime: number;
  volume: number; // 0~100
}

/** 상태 초기 값 */
const initState = {
  status: PlaybackModuleStatus.Idle,
  isPlaying: false,
  isShuffle: false,
  currentTime: 0,
  durationTime: 0,
  volume: 30,
};

/**
 * playback 상태를 갖는 proxy 객체
 *
 * 상태 변경 시 일단 actions를 따로 두지 않고 심플하게 직접 상태를 변경한다
 *  - 필요하다고 판단될 때 actions 추가 예정
 */
export const playbackStore = proxy<PlaybackStore>(initState);
