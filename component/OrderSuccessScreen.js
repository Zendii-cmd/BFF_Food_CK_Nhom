import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Contexts/ThemeProvider';

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const getThemeColor = (light, dark) => (isDarkMode ? dark : light);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // State để điều khiển confetti chỉ bắn 1 lần khi màn hình load
  const [showConfettiLeft, setShowConfettiLeft] = useState(true);
  const [showConfettiRight, setShowConfettiRight] = useState(true);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [fadeAnim]);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: getThemeColor('#fff', '#121212') }]}>
      {/* Confetti bắn từ trái */}
      {showConfettiLeft && (
        <ConfettiCannon
          count={50}
          origin={{ x: 0, y: 300 }}
          fadeOut={true}
          onAnimationEnd={() => setShowConfettiLeft(false)}
          colors={['#ff0a54', '#ff477e', '#ff85a1', '#fbb1b1', '#f9bec7']}
          autoStart={true}
          fallSpeed={3000}
        />
      )}

      {/* Confetti bắn từ phải */}
      {showConfettiRight && (
        <ConfettiCannon
          count={50}
          origin={{ x: 350, y: 300 }} // căn chỉnh x = width màn hình - khoảng offset
          fadeOut={true}
          onAnimationEnd={() => setShowConfettiRight(false)}
          colors={['#0aff99', '#2effd5', '#a1fff3', '#b1f9e3', '#c7f9e8']}
          autoStart={true}
          fallSpeed={3000}
          blastDirection={-Math.PI / 4} // Để pháo hoa bay sang trái
        />
      )}

      <Animated.Text
        style={[
          styles.title,
          { color: getThemeColor('#000', '#fff'), opacity: fadeAnim },
        ]}
      >
        🎉 Đơn hàng đã được đặt thành công!
      </Animated.Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: getThemeColor('#FF4500', '#990000') }]}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Text style={styles.buttonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
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
    backgroundColor:'#FFC107'
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
