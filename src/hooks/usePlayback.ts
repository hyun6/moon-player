import { TrackModel } from "../feature/track/track.model";
import { useSnapshot } from "valtio";
import { ReadonlyDeep } from "type-fest";
import { useEffect } from "react";
import {
  playbackModule,
  proxyPlaybackState,
} from "../feature/playback/playback.store";
import { PlaybackState } from "../feature/playback/playback.model";

// 의존성 흐름: UI -> custom hook -> feature(valtio state, action) <-(상태 변경 이벤트 콜백을 valtio state로 대체하기 위해 상호 의존 허용)-> business logic -> infra (tauri plugin, api...)
//  - 필요 시 custom hook이 UI state, action 매핑하는 역할..

/** UI use case actions */
export const playbackActions = {
  open: async (track: TrackModel) => {
    await playbackModule.open(track.source);
  },
  play: () => {
    playbackModule.play();
  },
  pause: () => {
    playbackModule.pause();
  },
  nextPlay: () => {},
  prevPlay: () => {},
  toggleShuffle: async () => {},
  volume: (percentage: number) => {
    playbackModule.volume(percentage);
  },
  seek: (msProgress: number) => {
    playbackModule.seek(msProgress);
  },
};

// hook은 UI와 feature를 단순히 매핑만 해주는 역할
// 여차하면 return [snapshot, actions] 코드만 남을듯, proxyState도 return 값에 추가해도 될 듯
export function usePlayback(): [
  ReadonlyDeep<PlaybackState>,
  typeof playbackActions
] {
  const playbackStateSnapshot = useSnapshot(proxyPlaybackState);

  useEffect(() => {
    playbackActions.volume(playbackStateSnapshot.volume);
  }, []);

  return [playbackStateSnapshot, playbackActions];
}
