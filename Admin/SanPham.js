import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import axios from 'axios';
import ModalSanPham from './ModalSanPham';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://bff-food-ck-nhom.onrender.com/api';

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/sanpham/list`);
      setProducts(res.data.data.sanPhams);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm:', err.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá sản phẩm này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
              Alert.alert('Lỗi', 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.');
              return;
            }
            await axios.delete(`${API_BASE}/sanpham/${id}`, {
              headers: { Authorization: 'Bearer ' + token },
            });
            fetchProducts();
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xoá sản phẩm.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.hinhAnh && (
        <Image
          source={{ uri: item.hinhAnh }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.name} numberOfLines={1}>{item.tenSanPham}</Text>
          <Text style={styles.price}>{item.gia.toLocaleString()} đ</Text>
        </View>
        <Text style={styles.category}>Danh mục: {item.danhMuc?.tenDanhMuc || 'Không có'}</Text>
        {Array.isArray(item.kichThuoc) && item.kichThuoc.length > 0 && (
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeTitle}>Kích thước:</Text>
            {item.kichThuoc.map((kt, index) => (
              <Text key={index} style={styles.sizeItem}>
                • {kt.tenKichThuoc} (+{kt.giaThem.toLocaleString()} đ)
              </Text>
            ))}
          </View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => {
              setEditingProduct(item);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
            style={styles.actionBtn}
          >
            <Ionicons name="create-outline" size={22} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            activeOpacity={0.7}
            style={[styles.actionBtn, { marginLeft: 20 }]}
          >
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách sản phẩm</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => {
            setEditingProduct(null);
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.addText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>

      <ModalSanPham
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefresh={fetchProducts}
        editingProduct={editingProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
    color: '#222',
  },
  price: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '700',
  },
  category: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  sizeContainer: {
    marginBottom: 6,
  },
  sizeTitle: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 2,
  },
  sizeItem: {
    marginLeft: 10,
    color: '#555',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#e9f0ff',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: '#ff6600',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#ff6600',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 16,
  },
});
