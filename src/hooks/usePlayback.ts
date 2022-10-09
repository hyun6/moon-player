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
