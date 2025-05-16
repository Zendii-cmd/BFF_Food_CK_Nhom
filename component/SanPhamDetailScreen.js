import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../API/auth';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SanPhamDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [sanPham, setSanPham] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchSanPham = async () => {
      try {
        const data = await authApi.getSanPhamById(id);
        setSanPham(data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSanPham();
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      await authApi.addToCart(sanPham._id, quantity); // gọi API từ auth.js
      Alert.alert('✅ Thành công', 'Sản phẩm đã được thêm vào giỏ hàng!');
      navigation.navigate('Home'); // chuyển về trang Home
    } catch (error) {
      Alert.alert('❌ Lỗi', 'Không thể thêm vào giỏ hàng');
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (!sanPham) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const tongTien = (sanPham.gia * quantity).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFD232' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết món ăn</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: sanPham.hinhAnh }} style={styles.image} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.foodName}>{sanPham.tenSanPham}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={handleDecrease}>
                <AntDesign name="minuscircleo" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrease}>
                <AntDesign name="pluscircleo" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.restaurant}>BFF Restaurant</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Size: Medium</Text>
            <Text style={styles.infoText}>Calories: 150kcal</Text>
            <Text style={styles.infoText}>Cooking: 10-12 Min</Text>
          </View>

          <Text style={styles.description}>
            {sanPham.moTa || 'Mô tả đang được cập nhật...'}
          </Text>

          <Text style={styles.ingredientsTitle}>Ingredients</Text>
          <View style={styles.ingredientsRow}>
            <IngredientItem icon="🥄" label="Salt" />
            <IngredientItem icon="🍗" label="Chicken" />
            <IngredientItem icon="🧅" label="Onion" />
            <IngredientItem icon="🧄" label="Garlic" />
            <IngredientItem icon="🌶️" label="Peppers" />
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>{tongTien}</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const IngredientItem = ({ icon, label }) => (
  <View style={styles.ingredientItem}>
    <Text style={styles.ingredientIcon}>{icon}</Text>
    <Text style={styles.ingredientLabel}>{label}</Text>
  </View>
);

export default SanPhamDetailScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFD232',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    paddingBottom: 40,
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFD232',
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  restaurant: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ingredientItem: {
    alignItems: 'center',
  },
  ingredientIcon: {
    fontSize: 24,
  },
  ingredientLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
