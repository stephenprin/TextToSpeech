import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
type CustomButtonProps = { title: string } & PressableProps;

const CustomButton = ({ title, ...props }: CustomButtonProps) => {
  return (
    <Pressable {...props} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
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
