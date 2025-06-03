import AudioPlayer from "@/components/AudioPlayer";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

const SpeechToText = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFileUri, setAudioFileUri] = useState<string | null>();

  const handleStartRecord = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
    setAudioFileUri("");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      setAudioFileUri(audioRecorder.uri);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);
  return (
    <LinearGradient colors={["#551a51", "#111342"]} style={styles.container}>
      {isRecording ? (
        <LinearGradient
          colors={["#7F00FF", "#E100FF"]}
          style={styles.stopButton}
        >
          <Pressable onPress={stopRecording} style={styles.buttonInner}>
            <FontAwesome5 name="stop" size={115} color="black" />
          </Pressable>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={["#7F00FF", "#E100FF"]}
          style={styles.stopButton}
        >
          <Pressable onPress={handleStartRecord} style={styles.recordButton}>
            <FontAwesome5 name="microphone" size={115} color="black" />
          </Pressable>
        </LinearGradient>
      )}
      {audioFileUri && <AudioPlayer uri={audioFileUri} />}
    </LinearGradient>
  );
};

export default SpeechToText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  stopButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E100FF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginTop: 150,
  },
  buttonInner: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  stopText: {
    fontWeight: "700",
    color: "white",
    fontSize: 16,
    textTransform: "uppercase",
  },
  recordButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E100FF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  recordText: {
    color: "white",
    fontWeight: "600",
  },
});
