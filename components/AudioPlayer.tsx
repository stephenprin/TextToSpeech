import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

type AudioPlayerProps = {
  uri: string;
  onPlaybackPositionChange?: (progress: number) => void;
};

export default function AudioPlayer({
  uri,
  onPlaybackPositionChange,
}: AudioPlayerProps) {
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const [playBackBarWidth, setPlayBackBarWidth] = useState<number>(0);

  const isPlaying = status.playing;
  const progress = status.currentTime / status.duration;

  useEffect(() => {
    onPlaybackPositionChange?.(status.currentTime);
  }, [status.currentTime, onPlaybackPositionChange]);

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish, player]);

  return (
    <Pressable
      onLayout={(e) => {
        setPlayBackBarWidth(e.nativeEvent.layout.width);
      }}
      onPress={(e) => {
        player.seekTo(
          (e.nativeEvent.locationX / playBackBarWidth) * player.duration
        );
      }}
      style={{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 20,
      }}
    >
      {isPlaying ? (
        <FontAwesome5
          name="pause"
          size={22}
          color="#f6d09a"
          onPress={() => player.pause()}
        />
      ) : (
        <FontAwesome5
          name="play"
          size={22}
          color="#f6d09a"
          onPress={() => player.play()}
        />
      )}

      <View
        style={{
          height: 10,
          backgroundColor: "gray",
          flex: 1,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            height: 10,
            backgroundColor: "#7F00FF",
            width: `${progress * 100}%`,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 15,
            backgroundColor: "#7F00FF",
            borderWidth: 2,
            borderColor: "#fff",
            position: "absolute",
            left: `${progress * 100}%`,
            transform: [{ translateX: -7.5 }, { translateY: -2.5 }],
          }}
        />
      </View>
    </Pressable>
  );
}
