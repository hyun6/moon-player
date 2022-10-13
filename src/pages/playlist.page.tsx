import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { PlayArrow, PlaylistAdd, Repeat } from "@mui/icons-material";
import { TrackId, TrackModel } from "../feature/track/track.model";
import { usePlayback } from "../hooks/usePlayback";
import { usePlaylist } from "../hooks/usePlaylist";
import { Box } from "@mui/material";

function Track({
  track,
  onItemChecked,
}: {
  track: TrackModel;
  onItemChecked: (id: TrackId, isChecked: boolean) => void;
}) {
  const [bChecked, setChecked] = useState(false);
  const [_, actions] = usePlayback();

  const onCheckHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setChecked(!bChecked);
    // logger('checked track id: ', track.id);
    onItemChecked(track.id, target.checked);
  };

  // TODO: usePlaylist action으로 분리, controller는 hook에서만 사용하고 UI는 hook만 사용
  const handleTrackPlayClick = async () => {
    actions.open(track);
    actions.play();
    // 사용자가 직접 재생목록에서 곡을 선택해 재생하는 경우 다시 셔플한다
    // - https://wiki.daumkakao.com/pages/viewpage.action?pageId=983723626
    // actions.reShuffle();
  };

  return (
    <li>
      <input type="checkbox" checked={bChecked} onChange={onCheckHandler} />
      <b className="text-lg font-bold pl-2">{track.name}</b>
      <button
        type="button"
        className="playlistTrackPlay"
        style={{ height: 25, width: 25, margin: 5 }}
        onClick={handleTrackPlayClick}
      >
        <PlayArrow />
      </button>
    </li>
  );
}

export function PlaylistPage() {
  const [playlistState, playlistActions] = usePlaylist();
  const [checkedItems, setCheckedItems] = useState(new Set<TrackId>());
  const refPlaylist = useRef<HTMLDivElement>(null);

  const handleItemChecked = (id: TrackId, isChecked: boolean) => {
    if (isChecked) {
      checkedItems.add(id);
      setCheckedItems(checkedItems);
    } else if (!isChecked && checkedItems.has(id)) {
      checkedItems.delete(id);
      setCheckedItems(checkedItems);
    }
  };

  const handleAddButtonClicked = () => {
    // TODO: open file select dialog
    //  - validate audio file
    // playlistActions.add(track);
  };

  const handleDragEvent = (e: DragEvent) => {
    console.log("drag");
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    console.log("init drag & drop event");
    const handleDropFile = (e: DragEvent) => {
      console.log("drop");
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer?.files;
      if (files === undefined) return;

      const localFiles: { localPath: string }[] = [];

      /**
       * FileList가 배열이 아니라 아래와 같은 정의를 갖기 때문에 array, iterator 방식 순회 불가해 for loop 방식 사용
       * interface FileList {
          readonly length: number;
          item(index: number): File | null;
          [index: number]: File;
        }
       */
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const isAudioFile = file.type.includes("audio");
        if (isAudioFile) {
          console.log(file.webkitRelativePath);
          localFiles.push({ localPath: file.webkitRelativePath });
        }
      }

      playlistActions.addLocalFileList(localFiles);
    };

    const ref = refPlaylist.current;

    const initDragEvents = () => {
      ref?.addEventListener("dragenter", handleDragEvent);
      ref?.addEventListener("dragleave", handleDragEvent);
      ref?.addEventListener("dragover", handleDragEvent);
      ref?.addEventListener("drop", handleDropFile);
    };

    const removeDragEvents = () => {
      ref?.removeEventListener("dragenter", handleDragEvent);
      ref?.removeEventListener("dragleave", handleDragEvent);
      ref?.removeEventListener("dragover", handleDragEvent);
      ref?.removeEventListener("drop", handleDropFile);
    };

    // initDragEvents();

    return () => removeDragEvents();
  }, [playlistActions]);

  return (
    <Box ref={refPlaylist}>
      <div>PlaylistPage</div>
      <div>
        <button
          type="button"
          className="addTrackList"
          onClick={handleAddButtonClicked}
        >
          <PlaylistAdd />
        </button>
      </div>
      <ul>
        {playlistState.trackList.map((track: TrackModel) => (
          <Track
            track={track}
            onItemChecked={handleItemChecked}
            key={track.id}
          />
        ))}
      </ul>
    </Box>
  );
}
