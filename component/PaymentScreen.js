import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';

const PaymentScreen = () => {
  const route = useRoute();
  const cartItems = route.params?.cartItems || [];
  const navigation = useNavigation();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Text style={[styles.header, { color: theme.text }]}>Thanh toán</Text>

      {/* Địa chỉ */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Thông người nhận</Text>
        <View style={[styles.addressBox, { backgroundColor: theme.card }]}>
          <Ionicons name="home" size={18} color={theme.text} />
          <Text style={[styles.addressText, { color: theme.text }]}>
            Nguyễn Văn A - Tân Uyên, Bình Dương
          </Text>
        </View>
      </View>

      {/* Danh sách món ăn */}
      {cartItems.map((item, index) => (
        <View key={index} style={[styles.foodItem, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[{ fontWeight: 'bold' }, { color: theme.text }]}>{item.name}</Text>
            <Text style={{ color: theme.placeholder }}>
              ${item.price.toFixed(2)} x {item.quantity}
            </Text>
          </View>
          <Text style={[{ fontWeight: 'bold' }, { color: theme.text }]}>
            ${(item.price * item.quantity).toFixed(2)}
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
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Phương thức thanh toán
        </Text>
        <View style={[styles.paymentOption, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text }}>🔘 Thanh toán trực tuyến - ****123</Text>
        </View>
        <View style={[styles.paymentOption, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text }}>⚪ Thanh toán khi nhận hàng</Text>
        </View>
      </View>

      {/* Tổng tiền */}
      <View style={[styles.totalBox, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text }}>Sản phẩm: ${total}</Text>
        <Text style={{ color: theme.text }}>Giao hàng: $5.00</Text>
        <Text style={{ color: theme.text }}>Giảm giá: $0.00</Text>
        <Text style={[styles.total, { color: theme.text }]}>
          Tổng cộng: ${(parseFloat(total) + 5).toFixed(2)}
        </Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity 
        style={[styles.payButton, { backgroundColor: isDarkMode ? '#990000' : '#FF4500' }]}
        onPress={() => {
          //  Chuyển trang
          navigation.navigate('OrderSuccess', { total: (parseFloat(total) + 5).toFixed(2) });
        }}>
        
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginVertical: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4 },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  addressText: { marginLeft: 8 },
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
