import { useEffect, useMemo, useState } from "react";
import { htmlPlayback } from "../feature/playback/playback.html";
import { TrackModel } from "../models/track.model";

/** UI 상태 정의 */
interface PlaybackState {
  currentTrack?: TrackModel;
  isPlaying: boolean;
  isShuffle: boolean;
  currentTime: number;
  durationTime: number;
}

/** 상태 초기 값 */
const initState = {
  isPlaying: false,
  isShuffle: false,
  currentTime: 0,
  durationTime: 0,
};

/** UI use case 인터페이스 */
interface PlaybackActions {
  toggleShuffle(): void;
  open(track: TrackModel): void;
  play(): void;
  pause(): void;
  nextPlay(): void;
  prevPlay(): void;
}

export function usePlayback(): [PlaybackState, PlaybackActions] {
  const [state, setState] = useState<PlaybackState>(initState);

  // TODO
  // - playback event 수신
  // - playback 상태 관리
  // - playback 함수 UI와 연결
  const actions = useMemo<PlaybackActions>(
    () => ({
      open: (track: TrackModel) => {
        htmlPlayback.open(track.source);
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
    }),
    []
  );

  return [state, actions];
}
