export interface IPlaybackModule {
  open(sourceUrl: string): Promise<boolean>;
  play(progressMs?: number): void;
  pause(): void;
  resume(): void;
  close(): void;
  seek(progressMs: number): void;
  volume(percentage: number): void;
  mute(): void;
  getDuration(): number;
}
