import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

const EditAddressScreen = ({ route }) => {
  const navigation = useNavigation();
  
  // Dữ liệu mặc định từ route hoặc sử dụng addressData nếu không có dữ liệu từ route
  const initialAddress = route.params?.address || {};

  // Cập nhật trạng thái các trường
  const [name, setName] = useState(initialAddress.tenNguoiNhan);
  const [phone, setPhone] = useState(initialAddress.soDienThoai);
  const [street, setStreet] = useState(initialAddress.diaChiChiTiet);
  const [province, setProvince] = useState(initialAddress.thanhPho);
  const [isDefault, setIsDefault] = useState(initialAddress.macDinh);

  const handleSave = () => {
    // Thực hiện lưu địa chỉ, ở đây bạn có thể gọi API để lưu dữ liệu.
    Alert.alert("Đã lưu", "Địa chỉ đã được cập nhật.");
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert("Xoá địa chỉ", "Bạn có chắc chắn muốn xoá địa chỉ này?", [
      { text: "Huỷ" },
      { text: "Xoá", onPress: () => {
        // Thực hiện xóa địa chỉ
        navigation.goBack();
      }, style: "destructive" },
    ]);
  };

  const handleVerifyPhone = () => {
    Alert.alert("Xác minh", "Mã xác minh đã được gửi đến số điện thoại.");
  };

  return (
    <SafeAreaView style ={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Chỉnh sửa địa chỉ</Text>
      </View>

      {/* Các trường nhập địa chỉ */}
      <TextInput 
        style={styles.input} 
        placeholder="Họ tên" 
        value={name} 
        onChangeText={setName} 
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity onPress={handleVerifyPhone} style={styles.verifyBtn}>
          <Text style={{ color: '#fff' }}>Xác minh</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Số nhà, tên đường" 
        value={street} 
        onChangeText={setStreet} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Tỉnh/Thành phố" 
        value={province} 
        onChangeText={setProvince} 
      />

      {/* Đặt làm mặc định */}
      <View style={styles.switchContainer}>
        <Text>Đặt làm địa chỉ mặc định</Text>
        <Switch value={isDefault} onValueChange={setIsDefault} />
      </View>

      {/* Nút lưu */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu địa chỉ</Text>
      </TouchableOpacity>

      {/* Nút xoá */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={{ color: 'white' }}>Xoá địa chỉ</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#facc15', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { marginLeft: 10, fontSize: 20, fontWeight: 'bold' },
  input: {
    backgroundColor: 'white',
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
    color: 'white', fontWeight: 'bold',
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
