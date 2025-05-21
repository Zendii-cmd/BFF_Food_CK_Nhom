import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SanPham from './SanPham';
import DanhMuc from './DanhMuc';
import NguoiDung from './TrangCaNhan';

const Tab = createBottomTabNavigator();

const BottomTabAdmin = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Sản phẩm':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Danh mục':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Người dùng':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderColor: '#fcd34d', // màu vàng nhạt
          backgroundColor: 'white',
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Sản phẩm" component={SanPham} />
      <Tab.Screen name="Danh mục" component={DanhMuc} />
      <Tab.Screen name="Người dùng" component={NguoiDung} />
    </Tab.Navigator>
  );
};

export default BottomTabAdmin;
