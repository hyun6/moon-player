import { useEffect, useMemo, useState } from "react";
import { playbackService } from "../feature/playback/playback.service";
import { TrackId, TrackModel } from "../feature/track/track.model";
import { tauriListener } from "../tauri/listener";

/** UI 상태 정의 */
interface PlaylistState {
  trackList: TrackModel[];
  isSelectedRepeat: boolean;
  currentTrackId?: TrackId;
}

/** UI 전역 상태 객체 */
const initState = {
  trackList: [],
  isSelectedRepeat: false,
};

/**
 * UI에서 사용하는 use case 인터페이스 정의
 */
interface PlaylistActions {
  toggleSelectedRepeat(selectedTrackIds: TrackId[]): void;
  add(trackList: TrackModel): void;
  play(trackId: TrackId): void;
  addLocalFileList(files: { localPath: string }[]): void;
}

/**
 * 재생 큐의 state와 action(use case 함수)을 제공하는 커스텀훅
 *  - valtio 전역 상태 관리 라이브러리 사용
 */
export function usePlaylist(): [PlaylistState, PlaylistActions] {
  const [state] = useState(initState);

  useEffect(() => {
    tauriListener.onFileDropEvent(async (filePath: string[]) => {
      console.log("filePath: ", filePath);
      const track: TrackModel = {
        id: "0",
        name: filePath[0],
        source: filePath[0],
      };
      if (await playbackService.open(track.source)) {
        playbackService.play();
      }
    });
  }, [tauriListener]);

  const actions = useMemo<PlaylistActions>(
    () => ({
      add(trackList: TrackModel) {},
      async toggleSelectedRepeat(selectedTrackIds: TrackId[]) {},
      async play(trackId: TrackId) {
        const playTrack = state.trackList.find(
          (track: TrackModel) => track.id === trackId
        );
        if (playTrack === undefined) return;

        // await playbackController.open(playTrack);
        // playbackController.play();
      },
      addLocalFileList(files) {
        // playingQueueController.addLocalFileList(files);
      },
    }),
    []
  );

  return [state, actions];
}
