import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { authApi } from '../API/auth';
import { SafeAreaView } from 'react-native';
const SanPhamDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  const [sanPham, setSanPham] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6600" />
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

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    ) : !sanPham ? (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.container}>
        {sanPham.hinhAnh && (
          <Image source={{ uri: sanPham.hinhAnh }} style={styles.image} />
        )}
        <Text style={styles.title}>{sanPham.ten}</Text>
        <Text style={styles.price}>{sanPham.gia.toLocaleString()} VNĐ</Text>
        <Text style={styles.description}>{sanPham.moTa}</Text>
        {sanPham.danhMuc && (
          <Text style={styles.category}>Danh mục: {sanPham.danhMuc.ten}</Text>
        )}
      </ScrollView>
    )}
  </SafeAreaView>
);
};

export default SanPhamDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  category: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});
