// screens/PaymentScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../API/auth';
import { useFocusEffect } from '@react-navigation/native';
const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const cartItems = route.params?.cartItems || [];
  const selectedAddress = route.params?.selectedAddress || null;

  const [address, setAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress);
    } else {
      fetchAddress();
    }

    fetchDefaultPaymentMethod();
  }, [selectedAddress]);

  const fetchAddress = async () => {
    try {
      const data = await authApi.getAddressList();
      const defaultAddress = data.find(addr => addr.macDinh) || data[0];
      setAddress(defaultAddress);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải địa chỉ người nhận');
    }
  };

  const fetchDefaultPaymentMethod = async () => {
    try {
      const response = await authApi.getPaymentMethods();
      console.log('Payment methods:', response);
      const data = response.data; // lấy mảng bên trong
      const defaultMethod = data.find(pm => pm.macDinh) || null;
      setSelectedPayment(defaultMethod);
      console.log('Default payment method:', defaultMethod);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải phương thức thanh toán');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Địa chỉ */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Thông tin người nhận</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressList', { selectMode: true })}>
              <Text style={{ color: theme.primary }}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          {address ? (
            <View style={[styles.addressBox, { backgroundColor: theme.card }]}>
              <Ionicons name="home" size={18} color={theme.text} />
              <Text style={[styles.addressText, { color: theme.text }]}>
                {address.tenNguoiNhan} - {address.diaChiCuThe}, {address.diaChiChiTiet}, {address.thanhPho}
              </Text>
            </View>
          ) : (
            <Text style={{ color: theme.text }}>Chưa có địa chỉ</Text>
          )}
        </View>

        {/* Danh sách món ăn */}
        {cartItems.map((item, index) => (
          <View key={index} style={[styles.foodItem, { backgroundColor: theme.card }]}>
            <View>
              <Text style={[{ fontWeight: 'bold' }, { color: theme.text }]}>{item.name}</Text>
              <Text style={{ color: theme.placeholder }}>
                {item.price} x {item.quantity}
              </Text>
            </View>
            <Text style={[{ fontWeight: 'bold' }, { color: theme.text }]}>
              {item.price * item.quantity}
            </Text>
          </View>
        ))}

        {/* Voucher */}
        <TouchableOpacity
          style={[styles.voucher, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Voucher')}
        >
          <Ionicons name="pricetags-outline" size={18} color={theme.text} />
          <Text style={{ color: theme.text }}> Voucher</Text>
        </TouchableOpacity>

        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ghi chú</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Viết ghi chú cho đơn hàng của bạn (nếu có)"
            placeholderTextColor={theme.placeholder}
            multiline
          />
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Phương thức thanh toán</Text>
          <TouchableOpacity
  onPress={() =>
    navigation.navigate('PaymentMethod', {
      selectMode: true,
      onSelect: (method) => {
        setSelectedPayment(method);
        fetchDefaultPaymentMethod();
      },
    })
  }
>
  <View style={[styles.paymentOption, { backgroundColor: theme.card }]}>
    <Text style={{ color: theme.text }}>
      {selectedPayment
        ? `🔘 ${selectedPayment.loai}`
        : '⚪ Chọn phương thức thanh toán'}
    </Text>
    {selectedPayment && (
      <Text style={{ color: theme.placeholder }}>
        {selectedPayment.loai === 'the' 
          ? `Thẻ ngân hàng - ${selectedPayment.thongTinThe?.tenTrenThe || ''}`
          : selectedPayment.loai}
      </Text>
    )}
  </View>
</TouchableOpacity>


        </View>

        {/* Tổng tiền */}
        <View style={[styles.totalBox, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text }}>Sản phẩm: {total} VND</Text>
          <Text style={{ color: theme.text }}>Giao hàng: 15000 VND</Text>
          <Text style={{ color: theme.text }}>Giảm giá: 0 VND</Text>
          <Text style={[styles.total, { color: theme.text }]}>
            Tổng cộng: {total + 15000} VND
          </Text>
        </View>

        {/* Nút thanh toán */}
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: isDarkMode ? '#990000' : '#FF4500' }]}
          onPress={() => {
            if (!selectedPayment) {
              Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán');
              return;
            }

            navigation.navigate('OrderSuccess', {
              total: total + 15000,
              paymentMethodId: selectedPayment._id,
            });
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  section: { marginVertical: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4 },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  addressText: { marginLeft: 8, flex: 1 },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  voucher: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  noteInput: {
    height: 80,
    padding: 10,
    borderRadius: 8,
  },
  paymentOption: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  totalBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  payButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default PaymentScreen;
