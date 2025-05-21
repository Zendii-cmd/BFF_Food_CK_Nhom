import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_BASE = 'https://bff-food-ck-nhom.onrender.com/api';

export default function ModalDanhMuc({ visible, onClose, onRefresh, editingCategory }) {
    const [tenDanhMuc, setTenDanhMuc] = useState('');
    const [moTa, setMoTa] = useState('');

    useEffect(() => {
        if (editingCategory) {
            setTenDanhMuc(editingCategory.tenDanhMuc || '');
            setMoTa(editingCategory.moTa || '');

        } else {
            setTenDanhMuc('');
            setMoTa('');

        }
    }, [editingCategory]);

    const handleUpdate = async () => {
        if (!tenDanhMuc || !moTa) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường');
            return;
        }

        try {
            const data = {
                tenDanhMuc,
                moTa,
            };
            const token = await AsyncStorage.getItem('userToken');
            if (editingCategory) {
                await axios.put(`${API_BASE}/danhmuc/${editingCategory._id}`, data, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                Alert.alert('Thành công', 'Cập nhật danh mục thành công');
            } else {
                await axios.post(`${API_BASE}/danhmuc`, data, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                Alert.alert('Thành công', 'Thêm danh mục thành công');
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể cập nhật danh mục');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>
                        {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
                    </Text>

                    <ScrollView>
                        {editingCategory && (
                            <>
                                <Text style={styles.label}>ID danh mục</Text>
                                <Text style={styles.readOnlyText}>{editingCategory._id}</Text>
                            </>
                        )}

                        <Text style={styles.label}>Tên danh mục</Text>
                        <TextInput
                            style={styles.input}
                            value={tenDanhMuc}
                            onChangeText={setTenDanhMuc}
                            placeholder="Nhập tên danh mục"
                        />

                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={styles.input}
                            value={moTa}
                            onChangeText={setMoTa}
                            placeholder="Nhập mô tả"
                        />


                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                            <Text style={styles.cancelText}>Huỷ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.saveText}>
                                {editingCategory ? 'Cập nhật' : 'Lưu'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        maxHeight: '90%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
        color: '#333',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
        color: '#444',
    },
    input: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: '#555',
        fontWeight: '600',
        marginLeft: 6,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#ff6600',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
});
