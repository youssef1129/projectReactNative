import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Scanner from './src/components/Scanner';


export default function App() {

  const stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login' screenOptions={{
        headerShown:false,
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white' },
      }}>
        <stack.Screen name='Login' component={Login} />
        <stack.Screen name='Home' component={Home} />
        <stack.Screen name='Scanner' component={Scanner} />
      </stack.Navigator>
    </NavigationContainer>
  );
}
