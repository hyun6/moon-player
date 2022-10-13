import { HtmlPlaybackModule } from "../feature/playback/playback.html";
import { TrackModel } from "../feature/track/track.model";
import { useSnapshot } from "valtio";
import { ReadonlyDeep } from "type-fest";
import { useEffect } from "react";
import { IPlaybackModule } from "../feature/playback/playback.interface";
import { proxyPlaybackState } from "../feature/playback/playback.store";
import {
  PlaybackModuleState,
  PlaybackState,
} from "../feature/playback/playback.model";

/** UI use case 인터페이스 */

// TODO: state, action을 feature로 옮기기?
// - 역시 feature 단위로 구현을 묶는 편이 좋은듯
// - valtio 기반 UI 상태, UI use case 관리
//  ㄴ custom hook에서 사용
// - UI use case 처리를 위한 비지니스 로직
//  ㄴ 가능한 레이어를 두지 않고.. 필요할 때 레이어 추가하기
// - react-query 기반 서버 상태 관리
// 의존성 흐름: UI -> custom hook -> valtio state, action <-(상태 변경 이벤트 콜백을 valtio state로 대체하기 위해 상호 의존 허용)-> business logic -> infra (tauri plugin, api...)
//  - 필요 시 custom hook이 UI state, action 매핑하는 역할..
export const htmlPlayback: IPlaybackModule = new HtmlPlaybackModule();

interface PlaybackActions {
  toggleShuffle(): void;
  open(track: TrackModel): void;
  play(): void;
  pause(): void;
  nextPlay(): void;
  prevPlay(): void;
}

export const playbackActions: PlaybackActions = {
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
  const playbackStateSnapshot = useSnapshot(proxyPlaybackState);

  useEffect(() => {
    switch (proxyPlaybackState.state) {
      case PlaybackModuleState.Prepared: {
        // playbackState.currentTrack = playbackController.getCurrentTrack();
        // playbackState.durationTime = playbackController.getDuration();
        break;
      }
      case PlaybackModuleState.Started: {
        console.log("started");
        proxyPlaybackState.isPlaying = true;
        break;
      }
      case PlaybackModuleState.Paused: {
        console.log("paused");
        proxyPlaybackState.isPlaying = false;
        break;
      }
      case PlaybackModuleState.End: {
        proxyPlaybackState.isPlaying = false;
        // state.currentTime = 0;
        // playbackController.nextPlay();
        break;
      }
      default: {
        break;
      }
    }
  }, [proxyPlaybackState.state]);

  return [playbackStateSnapshot, playbackActions];
}
