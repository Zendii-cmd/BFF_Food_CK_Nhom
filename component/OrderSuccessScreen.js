import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Contexts/ThemeProvider'; // nếu bạn dùng context theme

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const getThemeColor = (light, dark) => (isDarkMode ? dark : light);

  return (
    <View style={[styles.container, { backgroundColor: getThemeColor('#fff', '#121212') }]}>
      <Text style={[styles.title, { color: getThemeColor('#000', '#fff') }]}>
        🎉 Đơn hàng đã được đặt thành công!
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: getThemeColor('#FF4500', '#990000') }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
