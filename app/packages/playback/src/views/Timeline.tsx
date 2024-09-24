import React from "react";
import { SEEK_BAR_DEBOUNCE } from "../lib/constants";
import { TimelineName } from "../lib/state";
import { useFrameNumber } from "../lib/use-frame-number";
import { useTimeline } from "../lib/use-timeline";
import { useTimelineBuffers } from "../lib/use-timeline-buffers";
import { useTimelineVizUtils } from "../lib/use-timeline-viz-utils";
import {
  FoTimelineContainer,
  FoTimelineControlsContainer,
  Playhead,
  Seekbar,
  SeekbarThumb,
  Speed,
  StatusIndicator,
} from "./PlaybackElements";

interface TimelineProps {
  name: TimelineName;
  style?: React.CSSProperties;
  controlsStyle?: React.CSSProperties;
}

/**
 * Renders a "classic" FO timeline with a seekbar, playhead, speed control, and status indicator.
 */
export const Timeline = React.memo(
  React.forwardRef<HTMLDivElement, TimelineProps>(
    ({ name, style, controlsStyle }, ref) => {
      const { playHeadState, config, play, pause, setSpeed } =
        useTimeline(name);
      const frameNumber = useFrameNumber(name);

      const { getSeekValue, seekTo } = useTimelineVizUtils();

      const seekBarValue = React.useMemo(() => getSeekValue(), [frameNumber]);

      const { loaded, loading } = useTimelineBuffers(name);

      const onChangeSeek = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newSeekBarValue = Number(e.target.value);
          seekTo(newSeekBarValue);
        },
        [seekTo]
      );

      const onSeekStart = React.useCallback(() => {
        pause();
        dispatchEvent(
          new CustomEvent("seek", {
            detail: { timelineName: name, start: true },
          })
        );
      }, [pause]);

      const onSeekEnd = React.useCallback(() => {
        dispatchEvent(
          new CustomEvent("seek", {
            detail: { timelineName: name, start: false },
          })
        );
      }, []);

      const [isHoveringSeekBar, setIsHoveringSeekBar] = React.useState(false);

      return (
        <FoTimelineContainer
          ref={ref}
          style={style}
          onMouseEnter={() => setIsHoveringSeekBar(true)}
          onMouseLeave={() => setIsHoveringSeekBar(false)}
        >
          <Seekbar
            value={seekBarValue}
            totalFrames={config.totalFrames}
            loaded={loaded}
            loading={loading}
            onChange={onChangeSeek}
            onSeekStart={onSeekStart}
            onSeekEnd={onSeekEnd}
            debounce={SEEK_BAR_DEBOUNCE}
          />
          <SeekbarThumb
            shouldDisplayThumb={isHoveringSeekBar}
            value={seekBarValue}
          />
          <FoTimelineControlsContainer style={controlsStyle}>
            <Playhead
              status={playHeadState}
              timelineName={name}
              play={play}
              pause={pause}
            />
            <Speed speed={config.speed ?? 1} setSpeed={setSpeed} />
            <StatusIndicator
              currentFrame={frameNumber}
              totalFrames={config.totalFrames}
            />
          </FoTimelineControlsContainer>
        </FoTimelineContainer>
      );
    }
  )
);
