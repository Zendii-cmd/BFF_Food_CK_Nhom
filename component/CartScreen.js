import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';
import {authApi} from '../API/auth';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? darkTheme : lightTheme;

    const loadCart = async () => {
        try {
            const data = await authApi.getCart();
            console.log(data);
            const mappedItems = data.gioHang.mucGioHang.map((item) => ({
                id: item.sanPham._id,
                title: item.sanPham.ten,
                price: item.sanPham.gia,
                uri: item.sanPham.hinhAnh,
                quantity: item.soLuong,
                kichThuoc: item.kichThuoc,
                ghiChu: item.ghiChu,
                selected: false,
            }));
            setCartItems(mappedItems);
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = async (id, delta) => {
        try {
            const item = cartItems.find(item => item.id === id);
            const newQuantity = item.quantity + delta;

            if (newQuantity <= 0) {
                await authApi.removeFromCart(id, item.kichThuoc);
            } else {
                await authApi.addToCart(id, delta, item.kichThuoc, item.ghiChu);
            }

            // Cập nhật giỏ hàng trực tiếp trên state để tránh gọi lại loadCart quá nhiều lần
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng:', error);
        }
    };


    const handleSelectItem = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };
    const handleSelectAllItems = () => {
        const allSelected = cartItems.every(item => item.selected);
        setCartItems(prev =>
            prev.map(item => ({ ...item, selected: !allSelected }))
        );
    };


    const total = cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Giỏ Hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                refreshing={refreshing}
                onRefresh={loadCart}
                renderItem={({ item }) => (
                    <View style={[styles.cartItem, { backgroundColor: theme.card }]}>
                        <TouchableOpacity onPress={() => handleSelectItem(item.id)}>
                            <Ionicons
                                name={item.selected ? "checkbox-outline" : "square-outline"}
                                size={24}
                                color={theme.text}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelectAllItems}>
                            <Text style={[styles.selectAllText, { color: theme.text }]}>
                                {cartItems.every(item => item.selected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </Text>
                        </TouchableOpacity>
                        <Image source={{ uri: item.uri }} style={styles.cartItemImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cartItemTitle, { color: theme.text }]}>{item.title}</Text>
                            <Text style={[styles.cartItemPrice, { color: theme.placeholder }]}>${item.price}</Text>
                        </View>
                        <View style={[styles.quantityContainer, { backgroundColor: theme.card }]}>
                            <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                                <Ionicons name="remove" size={20} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={[styles.quantityText, { color: theme.text }]}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                                <Ionicons name="add" size={20} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={[styles.bottomBar, { backgroundColor: theme.card }]}>
                <Text style={[styles.totalText, { color: theme.text }]}>${total}</Text>
                <TouchableOpacity
                    onPress={() => {
                        const selectedItems = cartItems.filter(item => item.selected);
                        navigation.navigate('Payment', { cartItems: selectedItems });
                    }}
                >
                    <Text style={{ color: theme.text }}>Mua hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartItem: {
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
    },
    cartItemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 12,
    },
    cartItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#777',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#FFA500',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityText: {
        marginHorizontal: 8,
        fontWeight: 'bold',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
