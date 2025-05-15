import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../API/auth';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [tongTien, setTongTien] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await authApi.getCart();
        setCart(data.mucGioHang);
        setTongTien(data.tongTien);
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchCart);

    fetchCart();

    return unsubscribe;
  }, [navigation]);

  const handleRemoveItem = async (item) => {
    try {
      await authApi.removeFromCart(item._id, item.kichThuoc || null);

      // Cập nhật giỏ hàng mới
      const updatedCart = cart.filter(cartItem => cartItem._id !== item._id);
      setCart(updatedCart);

      // Tính lại tổng tiền
      const newTongTien = updatedCart.reduce(
        (sum, cartItem) => sum + cartItem.sanPham.gia * cartItem._doc.soLuong, 0
      );
      setTongTien(newTongTien);

    } catch (error) {
      console.error('Lỗi khi xoá sản phẩm:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.sanPham.hinhAnh }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.tenSanPham} numberOfLines={1}>
          {item.sanPham.tenSanPham}
        </Text>
        <Text style={styles.priceText}>
          {item.sanPham.gia.toLocaleString()}đ
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{item._doc.soLuong}</Text>

        <TouchableOpacity 
          onPress={() => handleRemoveItem(item)} 
          style={styles.trashButton}
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePayment = () => {
  // Lọc dữ liệu cần thiết
  const simplifiedCartItems = cart.map(item => ({
    name: item.sanPham.tenSanPham,
    price: item.sanPham.gia,
    quantity: item._doc.soLuong,
  }));

  // Truyền qua màn hình thanh toán
  navigation.navigate('Payment', { cartItems: simplifiedCartItems });
};


  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        }
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Tổng tiền: {tongTien.toLocaleString()}đ
        </Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    height: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  tenSanPham: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#666',
    fontSize: 13,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    paddingHorizontal: 6,
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  trashButton: {
    marginLeft: 15,
  },
  totalContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
});
