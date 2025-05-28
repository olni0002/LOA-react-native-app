import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import GameBoard from "./app/board/GameBoard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lines of Action" component={WelcomeScreen} />
        <Stack.Screen name="Board" component={GameBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
