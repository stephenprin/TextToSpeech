import arrayBufferToBase64 from "@/utils";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const Index = () => {
  const [text, setText] = useState("");

  const handleConvertToAudio = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/tts", {
        method: "POST",
        body: JSON.stringify({
          text,
        }),
      });
      if (!response) throw new Error("Failed to fetch audio");
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = arrayBufferToBase64(arrayBuffer);

      const fileUri =
        FileSystem.documentDirectory + new Date().toISOString() + ".mp3";

      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("Convert to audio", fileUri);

      setText("");
    } catch (error) {
      console.error("Error converting to audio", error);
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF512F", "#DD2476", "#7F00FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter text to convert to speech"
            placeholderTextColor={"gainsboro"}
            multiline
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
        </View>
      </LinearGradient>

      <Pressable onPress={handleConvertToAudio} style={styles.button}>
        <Text style={styles.buttonText}>✨ Convert to Audio</Text>
      </Pressable>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0C0F14",
  },
  gradientBorder: {
    padding: 4,
    borderRadius: 12,
    marginTop: 20,
  },
  inputWrapper: {
    backgroundColor: "#2d2323",
    borderRadius: 8,
    minHeight: 100,
    padding: 10,
  },
  input: {
    fontSize: 16,
    color: "#f6f6f6",
    minHeight: 100,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6C4EFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
