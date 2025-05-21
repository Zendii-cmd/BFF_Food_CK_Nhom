import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { authApi } from '../API/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';

const AddressListScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const navigation = useNavigation();

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchAddresses = async () => {
    try {
      const data = await authApi.getAddressList();
      setAddresses(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách địa chỉ');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.addressItem, { backgroundColor: theme.card }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: theme.text }]}>
          {item.tenNguoiNhan}  |  {item.soDienThoai}
        </Text>
        <Text style={{ color: theme.text }}>{item.diaChiCuThe}</Text>
        <Text style={{ color: theme.placeholder }}>
          {item.diaChiChiTiet}, {item.thanhPho}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditAddress', { address: item })}
      >
        <Ionicons name="create-outline" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Danh sách địa chỉ</Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: isDarkMode ? '#FFA500' : '#FFA500' }]}
        onPress={() => navigation.navigate('AddAddress')}
      >
        <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddressListScreen;

const styles = StyleSheet.create({
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
  addressItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
