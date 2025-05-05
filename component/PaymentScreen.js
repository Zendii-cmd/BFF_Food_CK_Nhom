// component/PaymentScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const route = useRoute();
  const cartItems = route.params?.cartItems || [];
  const navigation = useNavigation();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Thanh toán</Text>

      {/* Địa chỉ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông người nhận</Text>
        <View style={styles.addressBox}>
          <Ionicons name="home" size={18} color="black" />
          <Text style={styles.addressText}>Nguyễn Văn A - Tân Uyên, Bình Dương</Text>
        </View>
      </View>

      {/* Danh sách món ăn */}
      {cartItems.map((item, index) => (
        <View key={index} style={styles.foodItem}>
          <View>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: 'gray' }}>${item.price.toFixed(2)} x {item.quantity}</Text>
          </View>
          <Text style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}


      {/* Voucher */}
      <TouchableOpacity
        style={styles.voucher}
        onPress={() => navigation.navigate('Voucher')}
      >
        <Ionicons name="pricetags-outline" size={18} color="black" />
        <Text> Voucher</Text>
      </TouchableOpacity>

      {/* Ghi chú */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ghi chú</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Viết ghi chú cho đơn hàng của bạn (nếu có)"
          multiline
        />
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentOption}><Text>🔘 Thanh toán trực tuyến - ****123</Text></View>
        <View style={styles.paymentOption}><Text>⚪ Thanh toán khi nhận hàng</Text></View>
      </View>

      {/* Tổng tiền */}
      <View style={styles.totalBox}>
        <Text>Sản phẩm: ${total}</Text>
        <Text>Giao hàng: $5.00</Text>
        <Text>Giảm giá: $0.00</Text>
        <Text style={styles.total}>Tổng cộng: ${(parseFloat(total) + 5).toFixed(2)}</Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#facc15' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginVertical: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4 },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', padding: 10, borderRadius: 8,
  },
  addressText: { marginLeft: 8 },
  foodItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 10, marginVertical: 4, borderRadius: 8,
  },
  voucher: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fcd34d', padding: 10, marginVertical: 10, borderRadius: 8,
  },
  noteInput: {
    backgroundColor: '#fff', height: 80, padding: 10, borderRadius: 8,
  },
  paymentOption: {
    backgroundColor: '#fff', padding: 10, borderRadius: 8, marginVertical: 5,
  },
  totalBox: {
    backgroundColor: '#fff', padding: 10, borderRadius: 8, marginTop: 12,
  },
  total: {
    fontWeight: 'bold', fontSize: 16, marginTop: 8,
  },
  payButton: {
    backgroundColor: '#ea580c', alignItems: 'center', padding: 16,
    borderRadius: 10, marginVertical: 20,
  },
});

export default PaymentScreen;
