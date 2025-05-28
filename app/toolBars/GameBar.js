import { StyleSheet, View, Text, Pressable } from "react-native";

function GameBar(props) {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={props.currentPlayer === "human" ? props.resetFunction : null}
      >
        <View style={styles.exitButton}>
          <Text>Restart</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 40,
    width: 320,
    top: -20,
    flexDirection: "row-reverse",
  },
  exitButton: {
    height: 40,
    width: 60,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameBar;
