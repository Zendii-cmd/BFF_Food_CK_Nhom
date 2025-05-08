import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';

const VoucherScreen = () => {
  const [isShippingChecked, setIsShippingChecked] = useState(false);
  const [voucher1Checked, setVoucher1Checked] = useState(false);
  const [voucher2Checked, setVoucher2Checked] = useState(false);
  const [voucher3Checked, setVoucher3Checked] = useState(false);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color={theme.text} />
        <Text style={[styles.headerText, { color: theme.text }]}>Chọn voucher</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.placeholder} style={{ marginHorizontal: 10 }} />
        <TextInput
          placeholder="Tìm kiếm voucher"
          placeholderTextColor={theme.placeholder}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Vận chuyển */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Voucher vận chuyển</Text>
        <View style={[styles.voucherItem, { backgroundColor: theme.primary }]}>
          <Icon name="car-outline" size={30} color="#fff" />
          <Text style={styles.voucherText}>Giảm giá 10%</Text>
          <Switch value={isShippingChecked} onValueChange={setIsShippingChecked} />
        </View>

        {/* Voucher khác */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Voucher</Text>

        <View style={[styles.voucherItem, { backgroundColor: theme.primary }]}>
          <Icon name="cart-outline" size={30} color="#fff" />
          <Text style={styles.voucherText}>Giảm giá 10% với đơn hàng 0K</Text>
          <Switch value={voucher1Checked} onValueChange={setVoucher1Checked} />
        </View>

        <View style={[styles.voucherItem, { backgroundColor: theme.primary }]}>
          <Icon name="cart-outline" size={30} color="#fff" />
          <Text style={styles.voucherText}>Giảm giá 20% với đơn hàng trên 200K</Text>
          <Switch value={voucher2Checked} onValueChange={setVoucher2Checked} />
        </View>

        <View style={[styles.voucherItem, { backgroundColor: theme.primary }]}>
          <Icon name="cart-outline" size={30} color="#fff" />
          <Text style={styles.voucherText}>Giảm giá 25% với đơn hàng trên 500K</Text>
          <Switch value={voucher3Checked} onValueChange={setVoucher3Checked} />
        </View>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#990000' : '#FF4500' }]}>
        <Text style={styles.buttonText}>Áp dụng voucher</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    marginHorizontal: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  voucherItem: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
    borderWidth: 2, 
  borderColor: '#fff',
  },
  voucherText: {
    flex: 1,
    marginHorizontal: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
