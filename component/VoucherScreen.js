import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Contexts/ThemeProvider'; // import hook của bạn
import { lightTheme, darkTheme } from '../Contexts/theme'; // import 2 theme có sẵn
import { SafeAreaView } from 'react-native-safe-area-context';

const VoucherScreen = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // lấy trạng thái dark mode từ context
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [selectedShipping, setSelectedShipping] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const toggleShipping = () => setSelectedShipping(!selectedShipping);
  const selectVoucher = (id) => setSelectedVoucher(id === selectedVoucher ? null : id);

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Chọn voucher</Text>
        
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.input }]}>
        <Icon name="search" size={20} color={theme.placeholder} />
        <TextInput
          placeholder="Tìm kiếm voucher"
          placeholderTextColor={theme.placeholder}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Shipping Voucher */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Voucher vận chuyển</Text>
        <TouchableOpacity
          style={[styles.voucherItem, { backgroundColor: theme.card }]}
          onPress={toggleShipping}
        >
          <Icon name="car-outline" size={28} color={theme.text} />
          <Text style={[styles.voucherText, { color: theme.text }]}>Giảm giá 10%</Text>
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.text, backgroundColor: theme.card },
            ]}
          >
            {selectedShipping && <View style={[styles.checkboxTick, { backgroundColor: theme.text }]} />}
          </View>
        </TouchableOpacity>

        {/* Product Vouchers */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Voucher</Text>
        {[
          { id: 1, text: 'Giảm giá 10% với đơn hàng 0K' },
          { id: 2, text: 'Giảm giá 20% với đơn hàng trên 200K' },
          { id: 3, text: 'Giảm giá 25% với đơn hàng trên 500K' },
        ].map((voucher) => (
          <TouchableOpacity
            key={voucher.id}
            style={[styles.voucherItem, { backgroundColor: theme.card }]}
            onPress={() => selectVoucher(voucher.id)}
          >
            <Icon name="cart-outline" size={28} color={theme.text} />
            <Text style={[styles.voucherText, { color: theme.text }]}>{voucher.text}</Text>
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.text, backgroundColor: theme.card },
              ]}
            >
              {selectedVoucher === voucher.id && (
                <View style={[styles.checkboxTick, { backgroundColor: theme.text }]} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={[styles.applyButton, { backgroundColor: isDarkMode ? '#990000' : '#FF4500' }]}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Áp dụng voucher</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
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
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  voucherText: {
    flex: 1,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxTick: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  applyButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
