import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { authApi } from '../API/auth';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authApi.getCurrentUser();
        setUser(data);
        setHoTen(data.hoTen || '');
        setNgaySinh(data.ngaySinh || '');
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const { data } = await authApi.updateUserInfo(hoTen, ngaySinh);
      alert('Cập nhật thông tin thành công!');
      setUser(data);
    } catch (error) {
      alert('Cập nhật thông tin không thành công.');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Họ tên:</Text>
        <TextInput
          style={styles.input}
          value={hoTen}
          onChangeText={setHoTen}
          placeholder="Nhập họ tên"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Ngày sinh:</Text>
        <TextInput
          style={styles.input}
          value={ngaySinh}
          onChangeText={setNgaySinh}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
