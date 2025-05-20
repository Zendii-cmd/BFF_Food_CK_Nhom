import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Contexts/ThemeProvider'; // chỉnh lại path nếu cần
import { lightTheme, darkTheme } from '../Contexts/theme'; // chỉnh lại path nếu cần
import {authApi} from '../API/auth'; // chỉnh lại path nếu cần

const EditAddressScreen = ({ route }) => {
  const navigation = useNavigation();
  const initialAddress = route.params?.address || {};

  const [name, setName] = useState(initialAddress.tenNguoiNhan);
  const [phone, setPhone] = useState(initialAddress.soDienThoai);
  const [street, setStreet] = useState(initialAddress.diaChiChiTiet);
  const [province, setProvince] = useState(initialAddress.thanhPho);
  const [isDefault, setIsDefault] = useState(initialAddress.macDinh);

  const { isDarkMode, toggleDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleSave = async () => {
    try {
      const data = {
        tenNguoiNhan: name,
        soDienThoai: phone,
        diaChiChiTietChiTiet: street,
        thanhPho: province,
      };

      await authApi.updateAddress(initialAddress._id, data);

      if (isDefault && !initialAddress.macDinh) {
        await authApi.setDefaultAddress(initialAddress._id);
      }

      Alert.alert("Thành công", "Địa chỉ đã được cập nhật.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật địa chỉ.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Xoá địa chỉ", "Bạn có chắc chắn muốn xoá địa chỉ này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        onPress: async () => {
          try {
            await authApi.deleteAddress(initialAddress._id);
            Alert.alert("Thành công", "Đã xoá địa chỉ.");
            navigation.goBack();
          } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể xoá địa chỉ.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleVerifyPhone = () => {
    Alert.alert("Xác minh", "Mã xác minh đã được gửi đến số điện thoại.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={theme.text} onPress={() => navigation.goBack()} />
          <Text style={[styles.headerText, { color: theme.text }]}>Chỉnh sửa địa chỉ</Text>
        </View>

        {/* Nút đổi theme */}
        <TouchableOpacity onPress={toggleDarkMode} style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.text }}>
            Chuyển sang {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>

        {/* Form */}
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Họ tên"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.input, color: theme.text }]}
            placeholder="Số điện thoại"
            placeholderTextColor={theme.placeholder}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity onPress={handleVerifyPhone} style={styles.verifyBtn}>
            <Text style={{ color: '#fff' }}>Xác minh</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Số nhà, tên đường"
          placeholderTextColor={theme.placeholder}
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Tỉnh/Thành phố"
          placeholderTextColor={theme.placeholder}
          value={province}
          onChangeText={setProvince}
        />

        <View style={styles.switchContainer}>
          <Text style={{ color: theme.text }}>Đặt làm địa chỉ mặc định</Text>
          <Switch value={isDefault} onValueChange={setIsDefault} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu địa chỉ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={{ color: 'white' }}>Xoá địa chỉ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  verifyBtn: {
    backgroundColor: '#ea580c',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ea580c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});

export default EditAddressScreen;
