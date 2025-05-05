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

const VoucherScreen = () => {
  const [isShippingChecked, setIsShippingChecked] = useState(false);
  const [voucher1Checked, setVoucher1Checked] = useState(false);
  const [voucher2Checked, setVoucher2Checked] = useState(false);
  const [voucher3Checked, setVoucher3Checked] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerText}>Chọn voucher</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginHorizontal: 10 }} />
        <TextInput
          placeholder="Tìm kiếm voucher"
          style={styles.searchInput}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Vận chuyển */}
        <Text style={styles.sectionTitle}>Voucher vận chuyển</Text>
        <View style={styles.voucherItem}>
          <Icon name="car-outline" size={30} color="#000" />
          <Text style={styles.voucherText}>Giảm giá 10%</Text>
          <Switch
            value={isShippingChecked}
            onValueChange={setIsShippingChecked}
          />
        </View>

        {/* Voucher khác */}
        <Text style={styles.sectionTitle}>Voucher</Text>

        <View style={styles.voucherItem}>
          <Icon name="cart-outline" size={30} color="#000" />
          <Text style={styles.voucherText}>Giảm giá 10% với đơn hàng 0K</Text>
          <Switch
            value={voucher1Checked}
            onValueChange={setVoucher1Checked}
          />
        </View>

        <View style={styles.voucherItem}>
          <Icon name="cart-outline" size={30} color="#000" />
          <Text style={styles.voucherText}>Giảm giá 20% với đơn hàng trên 200K</Text>
          <Switch
            value={voucher2Checked}
            onValueChange={setVoucher2Checked}
          />
        </View>

        <View style={styles.voucherItem}>
          <Icon name="cart-outline" size={30} color="#000" />
          <Text style={styles.voucherText}>Giảm giá 25% với đơn hàng trên 500K</Text>
          <Switch
            value={voucher3Checked}
            onValueChange={setVoucher3Checked}
          />
        </View>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Áp dụng voucher</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#FFA500',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  voucherText: {
    flex: 1,
    marginHorizontal: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFA500',
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
