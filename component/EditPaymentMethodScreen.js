import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { authApi } from '../API/auth';
import { useTheme } from '../Contexts/ThemeProvider'; // sửa lại đường dẫn đúng
import { lightTheme, darkTheme } from '../Contexts/theme';

const AddEditPaymentMethodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editItem = route.params?.item;

  // Theme
  const { isDarkMode, toggleDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [loai, setLoai] = useState(editItem?.loai || '');
  const [soThe, setSoThe] = useState(editItem?.thongTinThe?.soThe || '');
  const [tenTrenThe, setTenTrenThe] = useState(editItem?.thongTinThe?.tenTrenThe || '');
  const [ngayHetHan, setNgayHetHan] = useState(editItem?.thongTinThe?.ngayHetHan || '');
  const [cvv, setCvv] = useState(editItem?.thongTinThe?.cvv || '');
  const [isDefault, setIsDefault] = useState(editItem?.macDinh || false);

  useEffect(() => {
    navigation.setOptions({
      title: editItem ? 'Chỉnh sửa phương thức' : 'Thêm phương thức',
    });
  }, [navigation, editItem]);

  const handleSave = async () => {
    if (!soThe || !tenTrenThe || !ngayHetHan || !cvv) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }

    const data = {
      loai: 'the',
      thongTinThe: {
        soThe,
        tenTrenThe,
        ngayHetHan,
        cvv,
      },
      macDinh: isDefault,
    };

    try {
      let created;
      let phuongThucId;

      if (editItem) {
        await authApi.updatePaymentMethod(editItem._id, data);
        phuongThucId = editItem._id;
      } else {
        created = await authApi.addPaymentMethod(data);
        phuongThucId = created._id;
      }

      if (isDefault && phuongThucId) {
        await authApi.setDefaultPaymentMethod(phuongThucId);
      }

      Alert.alert('Thành công', editItem ? 'Cập nhật thành công' : 'Thêm thành công');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể lưu phương thức');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <View style={[styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            {editItem ? 'Chỉnh sửa phương thức' : 'Thêm phương thức'}
          </Text>

          
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.text }]}
          placeholder="Loại Thanh Toán"
          placeholderTextColor={theme.placeholder}
          value={loai}
          onChangeText={setLoai}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.text }]}
          placeholder="Số thẻ"
          placeholderTextColor={theme.placeholder}
          value={soThe}
          onChangeText={setSoThe}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.text }]}
          placeholder="Tên trên thẻ"
          placeholderTextColor={theme.placeholder}
          value={tenTrenThe}
          onChangeText={setTenTrenThe}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.text }]}
          placeholder="Ngày hết hạn (MM/YY)"
          placeholderTextColor={theme.placeholder}
          value={ngayHetHan}
          onChangeText={setNgayHetHan}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.text }]}
          placeholder="CVV"
          placeholderTextColor={theme.placeholder}
          value={cvv}
          onChangeText={setCvv}
          secureTextEntry
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <Text style={{ color: theme.text }}>Đặt mặc định</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: '#767577', true: theme.text }}
            thumbColor={isDefault ? theme.background : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.btnSave, { backgroundColor: isDarkMode ? '#FFA500' : theme.text }]}
          onPress={handleSave}
        >
          <Text style={[styles.btnSaveText, { color: isDarkMode ? '#000' : theme.background }]}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnSave: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSaveText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddEditPaymentMethodScreen;
