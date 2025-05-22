import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch,
  Modal, TextInput, ActivityIndicator, Image
} from 'react-native';
import { authApi } from '../API/auth';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();
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
      alert('Cập nhật thành công!');
      setUser(data);
      setModalVisible(false);
    } catch (error) {
      alert('Cập nhật thất bại!');
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      // Có thể chuyển về màn hình đăng nhập sau khi logout
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      alert('Đăng xuất thành công!');
    } catch (error) {
      alert('Đăng xuất thất bại!');
    }
  };
 
  const handleNavigateToChangePassword = () => {
    navigation.navigate('ForgetPassword');
  };
  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const getThemeColor = (light, dark) => (isDarkMode ? dark : light);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: getThemeColor('#fff', '#121212') }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: getThemeColor('#000', '#fff') }]}>{user.hoTen || 'Chưa có tên'}</Text>
            <Text style={[styles.email, { color: getThemeColor('#666', '#aaa') }]}>@{user.taiKhoan?.tenDangNhap || 'username'}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.editIcon, { color: getThemeColor('#000', '#fff') }]}>✏️</Text>
          </TouchableOpacity>
        </View>



        <View style={[styles.switchRow, { backgroundColor: getThemeColor('#FFA500', '#333') }]}>
          <Text style={[styles.switchLabel, { color: getThemeColor('#000', '#fff') }]}>💡 Dark mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: getThemeColor('#FFA500', '#333') }]}
          onPress={handleNavigateToChangePassword}
        >
          <Text style={[styles.buttonText, { color: getThemeColor('#000', '#fff') }]}>🔒 Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: getThemeColor('#FF4500', '#990000') }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Modal chỉnh sửa */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={[styles.modalContainer, { backgroundColor: getThemeColor('#fff', '#2a2a2a') }]}>
              <Text style={[styles.modalTitle, { color: getThemeColor('#000', '#fff') }]}>Chỉnh sửa thông tin</Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: getThemeColor('#fff', '#444'),
                    color: getThemeColor('#000', '#fff'),
                    borderColor: getThemeColor('#ccc', '#666'),
                  },
                ]}
                placeholder="Họ tên"
                placeholderTextColor={getThemeColor('#999', '#ccc')}
                value={hoTen}
                onChangeText={setHoTen}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: getThemeColor('#fff', '#444'),
                    color: getThemeColor('#000', '#fff'),
                    borderColor: getThemeColor('#ccc', '#666'),
                  },
                ]}
                placeholder="Ngày sinh (YYYY-MM-DD)"
                placeholderTextColor={getThemeColor('#999', '#ccc')}
                value={ngaySinh}
                onChangeText={setNgaySinh}
              />

              <TouchableOpacity style={[styles.button, { backgroundColor: getThemeColor('#FFA500', '#555') }]} onPress={handleUpdate}>
                <Text style={[styles.buttonText, { color: getThemeColor('#000', '#fff') }]}>Lưu</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ marginTop: 12, textAlign: 'center', color: getThemeColor('#000', '#fff') }}>Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  editIcon: {
    fontSize: 20,
    padding: 8,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
  },
  logoutText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
});
