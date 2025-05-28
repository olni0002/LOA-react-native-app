import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

function WelcomeScreen(props) {
  const [text, setText] = useState("");

  const handleServerConnect = async () => {
    try {
      const interfaces = await fetch(`${text}/api/interface`)
        .then((response) => response.json())
        .then((json) => {
          return json.interfaces;
        });

      if (
        interfaces ===
        "validateMove\ncomputerMove\ncheckResult\ngetPossibleMoves"
      )
        props.navigation.navigate("Board", { serverAddr: text });
    } catch (error) {
      alert("Can't connect.\nFormat is http://host:port");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Connect to a compatible server</Text>
      <TextInput
        style={styles.input}
        placeholder="http://"
        onChangeText={setText}
        onSubmitEditing={handleServerConnect}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default WelcomeScreen;
