import React, { useState } from 'react';
import {
  View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../API/auth';

const backgroundImage = { uri: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=600' };

const LoginScreen = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');
    if (!password.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');

    setLoading(true);

    try {
      // 1. Gọi login và nhận luôn object data
      const result = await authApi.login(email, password);
      const { token, data } = result;

      if (!data || !token) {
        throw new Error('Dữ liệu phản hồi không hợp lệ');
      }

      // 2. Lưu token với key userToken cho giống interceptor
      await AsyncStorage.multiSet([
        ['userToken', token],
        ['user', JSON.stringify(data)],
        ['vaitro', data.vaiTro],
      ]);

      // Gọi callback setUser nếu cần
      setUser && setUser(data);

      // Điều hướng về Home
      if (data.vaiTro === 'admin') {
        navigation.reset({ index: 0, routes: [{ name: 'BottomTabAdmin' }] }); // Giả sử bạn có màn AdminProduct
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    } catch (error) {
      let msg = 'Đăng nhập không thành công';
      if (error.response?.status === 400) {
        msg = error.response.data.message || msg;
      } else if (error.request) {
        msg = 'Không thể kết nối đến server. Kiểm tra mạng của bạn';
      } else {
        msg = error.message;
      }
      Alert.alert('Lỗi đăng nhập', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>BFF FOOD</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Đăng nhập</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              <Ionicons name={secureText ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Đăng nhập */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    padding: 20,
  },
  label: { fontSize: 20, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 16 },
  eyeIcon: { padding: 4 },
  loginButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff', fontSize: 18, fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#333', textAlign: 'center', marginBottom: 20, textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold',
  },
});

export default LoginScreen;
