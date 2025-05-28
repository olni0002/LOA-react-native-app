import { StyleSheet, View } from "react-native";

function CheckerPiece(props) {
  const borderStyle = [styles.circle, { backgroundColor: props.color }];

  if (props.selected) borderStyle.push(styles.selected);

  const fieldStyle = [styles.field];
  if (props.inMovePath) fieldStyle.push(styles.inMovePath);
  if (props.isAvailableToMove) fieldStyle.push(styles.availableToMove);

  return (
    <View style={fieldStyle}>
      <View style={styles.cellBorder}>
        {props.color !== "empty" ? <View style={borderStyle} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderColor: "black",
    borderRadius: 20,
    borderWidth: 2,
  },
  cellBorder: {
    width: 40,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderColor: "yellow",
  },
  availableToMove: {
    backgroundColor: "yellow",
  },
  field: {
    backgroundColor: "#AB5F1A",
  },
  inMovePath: {
    backgroundColor: "purple",
  },
});

export default CheckerPiece;
