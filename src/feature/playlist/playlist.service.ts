import { tauriListener } from "../../tauri/listener";
import { playbackService } from "../playback/playback.service";
import { TrackId, TrackModel } from "../track/track.model";
import { playlistStore } from "./playlist.store";

class PlaylistService {
  constructor() {
    this._initEvent();
  }

  add(track: TrackModel) {
    playlistStore.trackList.push(track);
  }

  async play(trackId: TrackId) {
    const playTrack = playlistStore.trackList.find(
      (track: TrackModel) => track.id === trackId
    );
    if (playTrack === undefined) return;

    // await playbackController.open(playTrack);
    // playbackController.play();
  }

  addLocalFileList(files: { localPath: string }[]) {
    // playingQueueController.addLocalFileList(files);
  }

  private _initEvent() {
    tauriListener.onFileDropEvent(async (filePath: string[]) => {
      console.log("filePath: ", filePath);
      const track: TrackModel = {
        id: "0",
        name: filePath[0],
        source: filePath[0],
      };

      // TODO: add to playlist as local file

      if (await playbackService.open(track.id)) {
        playbackService.play();
      }
    });
  }
}

export const playlistService = new PlaylistService();
