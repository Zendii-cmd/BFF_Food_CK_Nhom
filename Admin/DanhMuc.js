import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import ModalDanhMuc from './ModalDanhMuc';

const API_BASE = 'https://bff-food-ck-nhom.onrender.com/api';

const DanhMuc = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryEditing, setCategoryEditing] = useState(null);
  const isFocused = useIsFocused();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/danhmuc`);
      setCategories(res.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/danhmuc/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xoá danh mục:', err);
      Alert.alert('Lỗi', err?.response?.data?.message || 'Xoá thất bại');
    }
  };

  useEffect(() => {
    if (isFocused) fetchCategories();
  }, [isFocused]);

  const openModal = (category) => {
    setCategoryEditing(category);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.tenDanhMuc}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {item.moTa || 'Không có mô tả'}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Xác nhận xoá',
              'Bạn có chắc muốn xoá danh mục này?',
              [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Xoá', onPress: () => deleteCategory(item._id), style: 'destructive' }
              ]
            )
          }
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách danh mục</Text>
      </View>

      {/* Danh sách */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Chưa có danh mục nào.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal thêm/sửa */}
      <ModalDanhMuc
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCategoryEditing(null);
        }}
        editingCategory={categoryEditing}
        onRefresh={fetchCategories}
      />

      {/* Nút thêm */}
      <TouchableOpacity
        onPress={() => {
          setCategoryEditing(null);
          setModalVisible(true);
        }}
        style={styles.addButton}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Thêm Danh Mục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DanhMuc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: '#f0ad4e',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#27ae60',
    borderRadius: 50,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
