import { HtmlPlaybackModule } from "../feature/playback/playback.html";
import {
  PlaybackModuleState,
  PlaybackState,
} from "../models/playbackState.model";
import { TrackModel } from "../models/track.model";
import { proxy, useSnapshot } from "valtio";
import { ReadonlyDeep } from "type-fest";
import { useEffect } from "react";

/** UI use case 인터페이스 */
interface PlaybackActions {
  toggleShuffle(): void;
  open(track: TrackModel): void;
  play(): void;
  pause(): void;
  nextPlay(): void;
  prevPlay(): void;
}

/** 상태 초기 값 */
const initState = {
  state: PlaybackModuleState.Idle,
  isPlaying: false,
  isShuffle: false,
  currentTime: 0,
  durationTime: 0,
};

// TODO: state, action을 feature로 옮기기?
// - 역시 feature 단위로 구현을 묶는 편이 좋은듯
// - valtio 기반 UI 상태, UI use case 관리
//  ㄴ custom hook에서 사용
// - UI use case 처리를 위한 비지니스 로직
//  ㄴ 가능한 레이어를 두지 않고.. 필요할 때 레이어 추가하기
// - react-query 기반 서버 상태 관리
// 의존성 흐름: UI -> custom hook -> valtio state, action <-(상태 변경 이벤트 콜백을 valtio state로 대체하기 위해 상호 의존 허용)-> business logic -> infra (tauri plugin, api...)

export const playbackState = proxy<PlaybackState>(initState);
export const htmlPlayback = new HtmlPlaybackModule();
export const playbackActions = {
  open: async (track: TrackModel) => {
    await htmlPlayback.open(track.source);
  },
  play: () => {
    htmlPlayback.play();
  },
  pause: () => {
    htmlPlayback.pause();
  },
  nextPlay: () => {},
  prevPlay: () => {},
  toggleShuffle: async () => {},
};

export function usePlayback(): [ReadonlyDeep<PlaybackState>, PlaybackActions] {
  const playbackStateSnapshot = useSnapshot(playbackState);

  useEffect(() => {
    switch (playbackStateSnapshot.state) {
      case PlaybackModuleState.Prepared: {
        // playbackState.currentTrack = playbackController.getCurrentTrack();
        // playbackState.durationTime = playbackController.getDuration();
        break;
      }
      case PlaybackModuleState.Started: {
        playbackState.isPlaying = true;
        break;
      }
      case PlaybackModuleState.Paused: {
        playbackState.isPlaying = false;
        break;
      }
      case PlaybackModuleState.End: {
        playbackState.isPlaying = false;
        // state.currentTime = 0;
        // playbackController.nextPlay();
        break;
      }
      default: {
        break;
      }
    }
  }, [playbackStateSnapshot.state]);

  return [playbackStateSnapshot, playbackActions];
}
