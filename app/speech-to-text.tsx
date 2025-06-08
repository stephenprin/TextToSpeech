import AudioPlayer from "@/components/AudioPlayer";
import CustomButton from "@/components/CustomButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const SpeechToText = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFileUri, setAudioFileUri] = useState<string | null>();
  const [transcription, setTranscription] = useState<string>("");
  const [playBackPosition, setPlayBackPosition] = useState<number>(0);

  const handleStartRecord = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
    setAudioFileUri("");
    setTranscription("");
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

  const handleConvertToText = async () => {
    if (!audioFileUri) {
      Alert.alert("No audio file to convert");
      return;
    }
    const base64Audio = await FileSystem.readAsStringAsync(audioFileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    try {
      const response = await fetch("http://localhost:8081/api/stt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Audio }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error("Failed to convert audio to text");
      }
      const text = await response.json();
      console.log("Text", text);
      setTranscription(text.transcription || "");
    } catch (error) {
      console.error("Error converting to text", error);
      Alert.alert("Error", "Failed to convert audio to text");
    }
  };
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

      {audioFileUri && (
        <View>
          <AudioPlayer
            uri={audioFileUri}
            onPlaybackPositionChange={setPlayBackPosition}
          />
          <CustomButton title="Convert to Text" onPress={handleConvertToText} />
        </View>
      )}

      {transcription && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white", padding: 10, lineHeight:30 }}>
            {transcription.words.map((word, index) => (
              <Text
                key={index}
                style={{
                
                  backgroundColor:
                    playBackPosition > word.start && playBackPosition < word.end
                      ? "#6a0b6a"
                      : "transparent",
                }}
              >
                {word.text + " "}
              </Text>
            ))}
          </Text>
        </View>
      )}
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
