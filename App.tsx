import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Scanner from './src/components/Scanner';
import History from './src/screens/History';


export default function App() {

  const stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login' screenOptions={{
        headerShown:false,
        headerTitleAlign: 'center',
        headerTintColor: 'black',
        headerTitleStyle: { color: 'black' },
      }}>
        <stack.Screen name='Login' component={Login} />
        <stack.Screen name='Home' component={Home} />
        <stack.Screen name='Scanner' component={Scanner} />
        <stack.Screen name='History' component={History} />
      </stack.Navigator>
    </NavigationContainer>
  );
}
