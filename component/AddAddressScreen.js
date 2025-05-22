import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../API/auth';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';

const AddAddressScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [province, setProvince] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const getThemeColor = (light, dark) => (isDarkMode ? dark : light);

  const handleSave = async () => {
    if (!name || !phone || !street || !province) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const data = {
        tenNguoiNhan: name,
        soDienThoai: phone,
        diaChiChiTiet: street,
        thanhPho: province,
      };

      const res = await authApi.addAddress(data);

      if (isDefault) {
        await authApi.setDefaultAddress(res.data._id);
      }

      Alert.alert('Thành công', 'Đã thêm địa chỉ mới.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể thêm địa chỉ.');
    }
  };

  const handleVerifyPhone = () => {
    Alert.alert('Xác minh', 'Mã xác minh đã được gửi đến số điện thoại.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Thêm địa chỉ mới
          </Text>
        </View>

        {/* Form */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.input, color: theme.text },
          ]}
          placeholder="Họ tên"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                backgroundColor: theme.input,
                color: theme.text,
              },
            ]}
            placeholder="Số điện thoại"
            placeholderTextColor={theme.placeholder}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            onPress={handleVerifyPhone}
            style={[styles.verifyBtn, { backgroundColor: getThemeColor('#FF4500', '#990000') }]}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xác minh</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.input, color: theme.text },
          ]}
          placeholder="Số nhà, tên đường"
          placeholderTextColor={theme.placeholder}
          value={street}
          onChangeText={setStreet}
        />

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.input, color: theme.text },
          ]}
          placeholder="Tỉnh/Thành phố"
          placeholderTextColor={theme.placeholder}
          value={province}
          onChangeText={setProvince}
        />

        {/* Switch */}
        <View style={styles.switchContainer}>
          <Text style={{ fontWeight: '500', color: theme.text }}>
            Đặt làm địa chỉ mặc định
          </Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            thumbColor={isDarkMode ? '#fff' : '#fff'}
            trackColor={{ false: '#ccc', true: theme.primary }}
          />
        </View>

        {/* Nút thêm */}
        <TouchableOpacity
          style={[styles.button,{ backgroundColor: getThemeColor('#FF4500', '#990000') }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Thêm địa chỉ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  verifyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  button: {
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
