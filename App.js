// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { ThemeProvider } from './Contexts/ThemeProvider';

// import ForgotPasswordScreen from './component/ForgotPasswordScreen';
// import LoginScreen from './component/LoginScreen';
// import RegisterScreen from './component/RegisterScreen';
// import Bottomtab from './component/BottomTab';

// const Stack = createStackNavigator();

// const App = () => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const checkToken = async () => {
//             const token = await AsyncStorage.getItem('token');
//             if (token) {
//                 setUser(true);
//             }
//         };
//         checkToken();
//     }, []);

//     return (
//          <ThemeProvider>
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Home">
//                 <Stack.Screen name="Home" options={{ headerShown: false }}>
//                     {(props) => <Bottomtab {...props} />}
//                 </Stack.Screen>
//                 <Stack.Screen name="Login">
//                     {(props) => <LoginScreen {...props} setUser={setUser} />}
//                 </Stack.Screen>
//                 <Stack.Screen name="Register" component={RegisterScreen} />
//                 <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
//             </Stack.Navigator>
//         </NavigationContainer>
//           </ThemeProvider>
//     );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './Contexts/ThemeProvider';
import ForgotPasswordScreen from './component/ForgotPasswordScreen';
import LoginScreen from './component/LoginScreen';
import RegisterScreen from './component/RegisterScreen';

import Bottomtab from './component/BottomTab';
import OrderSuccessScreen from './component/OrderSuccessScreen';
import SanPhamDetailScreen from './component/SanPhamDetailScreen';
import AddAddressScreen from './component/AddAddressScreen';
import EditAddressScreen from './component/EditAddressScreen';
import PaymentScreen from './component/PaymentScreen';
import VoucherScreen from './component/VoucherScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setUser(true);
            }
        };

        checkToken();
    }, []);

    return (
        <ThemeProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
                <Stack.Screen name="Login">
                    {(props) => <LoginScreen {...props} setUser={setUser} />}
                </Stack.Screen>
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home"options={{ headerShown: false }}>
                    {(props) =>
                        user ? <Bottomtab {...props} /> : <LoginScreen {...props} setUser={setUser} />
                    }
                </Stack.Screen>
                <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ChiTietSanPham" component={SanPhamDetailScreen}options={{ headerShown: false }} />
                <Stack.Screen name="AddAddress" component={AddAddressScreen}options={{ headerShown: false }} />
                <Stack.Screen name="EditAddress" component={EditAddressScreen}options={{ headerShown: false }} />                
                <Stack.Screen name="Payment" component={PaymentScreen}options={{ headerShown: false }} />
                <Stack.Screen name="Voucher" component={VoucherScreen}options={{ headerShown: false }} />

            
            </Stack.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    );
};
export default App;
