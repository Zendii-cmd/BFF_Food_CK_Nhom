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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE = 'https://bff-food-ck-nhom.onrender.com/api';

export default function ModalSanPham({ visible, onClose, onRefresh, editingProduct }) {
    const [tenSanPham, setTenSanPham] = useState('');
    const [gia, setGia] = useState('');
    const [danhMuc, setDanhMuc] = useState('');
    const [hinhAnh, setHinhAnh] = useState('');
    const [kichThuoc, setKichThuoc] = useState([]);
    const [tenKichThuocMoi, setTenKichThuocMoi] = useState('');
    const [giaThemMoi, setGiaThemMoi] = useState('');

    useEffect(() => {
        if (editingProduct) {
            setTenSanPham(editingProduct.tenSanPham);
            setGia(editingProduct.gia.toString());
            setDanhMuc(editingProduct.danhMuc?._id || '');
            setHinhAnh(editingProduct.hinhAnh || '');
            setKichThuoc(Array.isArray(editingProduct.kichThuoc) ? editingProduct.kichThuoc : []);

        } else {
            setTenSanPham('');
            setGia('');
            setDanhMuc('');
            setHinhAnh('');
            setKichThuoc('');
        }
    }, [editingProduct]);

    const handleSubmit = async () => {
        if (!tenSanPham || !gia || !hinhAnh) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và giá sản phẩm.');
            return;
        }

        try {
            const data = {
                tenSanPham,
                gia: parseInt(gia),
                danhMuc,
                hinhAnh,
                kichThuoc,
            };
            const token = await AsyncStorage.getItem('userToken'); // Lấy token thực tế
            if (!token) {
                Alert.alert('Lỗi', 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.');
                return;
            }
            if (editingProduct) {
                await axios.put(`${API_BASE}/sanpham/${editingProduct._id}`, data, {
                    headers: { Authorization: 'Bearer ' + token },
                });
            } else {
                await axios.post(`${API_BASE}/sanpham`, data, {
                    headers: { Authorization: 'Bearer ' + token },
                });
            }

            onRefresh();
            onClose();
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể lưu sản phẩm.');
            console.error(err.message);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>
                        {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                    </Text>

                    <ScrollView>
                        <Text style={styles.label}>Tên sản phẩm</Text>
                        <TextInput
                            style={styles.input}
                            value={tenSanPham}
                            onChangeText={setTenSanPham}
                            placeholder="Nhập tên sản phẩm"
                        />

                        <Text style={styles.label}>Giá</Text>
                        <TextInput
                            style={styles.input}
                            value={gia}
                            onChangeText={setGia}
                            placeholder="Nhập giá"
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Thêm kích thước</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="Tên kích thước (VD: Nhỏ, Lớn)"
                                value={tenKichThuocMoi}
                                onChangeText={setTenKichThuocMoi}
                            />
                            <TextInput
                                style={[styles.input, { width: 80 }]}
                                placeholder="+Giá"
                                keyboardType="numeric"
                                value={giaThemMoi}
                                onChangeText={setGiaThemMoi}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.addSizeBtn}
                            onPress={() => {
                                if (tenKichThuocMoi.trim()) {
                                    setKichThuoc(prev => [
                                        ...prev,
                                        { tenKichThuoc: tenKichThuocMoi, giaThem: parseInt(giaThemMoi) || 0 },
                                    ]);
                                    setTenKichThuocMoi('');
                                    setGiaThemMoi('');
                                }
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#ff6600" />
                            <Text style={{ marginLeft: 6, color: '#ff6600', fontWeight: '600' }}>Thêm kích thước</Text>
                        </TouchableOpacity>
                        {Array.isArray(kichThuoc) && kichThuoc.map((size, index) => (
                            <View key={index} style={styles.sizeItem}>
                                <Text>{size.tenKichThuoc} (+{size.giaThem.toLocaleString()} đ)</Text>
                                <TouchableOpacity onPress={() => {
                                    setKichThuoc(prev => prev.filter((_, i) => i !== index));
                                }}>
                                    <Ionicons name="trash-outline" size={18} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}


                        <Text style={styles.label}>Link hình ảnh</Text>
                        <TextInput
                            style={styles.input}
                            value={hinhAnh}
                            onChangeText={setHinhAnh}
                            placeholder="Nhập URL hình ảnh"
                        />

                        <Text style={styles.label}>Danh mục (ID)</Text>
                        <TextInput
                            style={styles.input}
                            value={danhMuc}
                            onChangeText={setDanhMuc}
                            placeholder="Nhập ID danh mục"
                        />
                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                            <Text style={styles.cancelText}>Huỷ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.saveText}>
                                {editingProduct ? 'Cập nhật' : 'Lưu'}
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
