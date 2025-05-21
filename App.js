import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './Contexts/ThemeProvider';

import LoginScreen from './component/LoginScreen';
import RegisterScreen from './component/RegisterScreen';
import ForgotPasswordScreen from './component/ForgotPasswordScreen';
import Bottomtab from './component/BottomTab';
import OrderSuccessScreen from './component/OrderSuccessScreen';
import SanPhamDetailScreen from './component/SanPhamDetailScreen';
import EditAddressScreen from './component/EditAddressScreen';
import PaymentScreen from './component/PaymentScreen';
import VoucherScreen from './component/VoucherScreen';
import AddressListScreen from './component/AddressScreen';
import PaymentMethodScreen from './component/PaymentMethodScreen';
import AddPaymentMethod from './component/AddPaymentMethodScreen';
import BottomTabAdmin from './Admin/BottomTabAdmin';
import AddEditPaymentMethodScreen from './component/EditPaymentMethodScreen';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('user');
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (e) {
        console.error('Lỗi khi kiểm tra token', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Khi user thay đổi, điều hướng đến trang tương ứng
  useEffect(() => {
    if (user && navigationRef.current) {
      if (user.vaitro === 'admin') {
        navigationRef.current.navigate('BottomTabAdmin');
      } else {
        navigationRef.current.navigate('Home');
      }
    }
  }, [user]);

  if (isLoading) return null;

  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <Bottomtab {...props} />}
          </Stack.Screen>
          <Stack.Screen name="BottomTabAdmin" component={BottomTabAdmin} options={{ headerShown: false }} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChiTietSanPham" component={SanPhamDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddressList" component={AddressListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditAddress" component={EditAddressScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Voucher" component={VoucherScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} options={{ headerShown: false }} />
        <Stack.Screen name="AddEditPaymentMethod" component={AddEditPaymentMethodScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
