import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { paymentApi } from '../API/auth';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PaymentMethodsScreen = () => {
  const [methods, setMethods] = useState([]);
  const [tenPhuongThuc, setTenPhuongThuc] = useState('');
  const route = useRoute();
  const navigation = useNavigation();

  const fetchMethods = async () => {
    try {
      const data = await paymentApi.getPaymentMethods();
      setMethods(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải phương thức thanh toán');
    }
  };

  const handleAdd = async () => {
    if (!tenPhuongThuc.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên phương thức');
      return;
    }
    try {
      await paymentApi.addPaymentMethod({ tenPhuongThuc });
      setTenPhuongThuc('');
      fetchMethods();
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm phương thức');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await paymentApi.deletePaymentMethod(id);
            fetchMethods();
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id) => {
    try {
      await paymentApi.setDefaultPaymentMethod(id);
      fetchMethods();
    } catch {
      Alert.alert('Lỗi', 'Không thể đặt mặc định');
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const renderCard = (method) => {
    const logos = {
      PayPal: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
      Momo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
      ApplePay: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    };

    return (
      <View style={styles.card}>
        <Text style={styles.methodName}>{method.tenPhuongThuc}</Text>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: logos[method.tenPhuongThuc] }}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
          <TouchableOpacity onPress={() => Alert.alert('Chức năng chỉnh sửa đang được phát triển')}>
            <Ionicons name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={tenPhuongThuc}
          onChangeText={setTenPhuongThuc}
          placeholder="Tên phương thức mới"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Text style={{ color: '#fff' }}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={methods}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderCard(item)}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#FFD700', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, backgroundColor: '#fff' },
  addButton: {
    backgroundColor: '#FF5733',
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodName: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;
