import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Text to Speech",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="file-audio" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speech-to-text"
        options={{
          title: "Speech to Text",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="microphone" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
