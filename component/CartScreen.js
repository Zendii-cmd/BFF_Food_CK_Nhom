// CartScreen.js
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    CheckBox,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTab from './BottomTab'; // chỉnh lại đúng đường dẫn nếu cần

const { width } = Dimensions.get('window');

// Dữ liệu mẫu
const initialCartItems = [
    {
        id: '1',
        title: 'Veggie tomato',
        price: 9.22,
        quantity: 1,
        uri: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=60',
        selected: true,
    },
    {
        id: '2',
        title: 'Fried chicken m.',
        price: 10.22,
        quantity: 1,
        uri: 'https://images.unsplash.com/photo-1570824109315-6fe8c5671f2f?auto=format&fit=crop&w=400&q=60',
        selected: false,
    },
    {
        id: '3',
        title: 'Veggie tomato',
        price: 9.22,
        quantity: 1,
        uri: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=60',
        selected: false,
    },
    {
        id: '4',
        title: 'Fried chicken m.',
        price: 10.22,
        quantity: 1,
        uri: 'https://images.unsplash.com/photo-1570824109315-6fe8c5671f2f?auto=format&fit=crop&w=400&q=60',
        selected: true,
    },
];

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState(initialCartItems);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleSelectItem = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const total = cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Giỏ Hàng</Text>
                <View style={{ width: 24 }} /> {/* Để cân layout */}
            </View>

            {/* List Cart Items */}
            <FlatList
                data={cartItems}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <TouchableOpacity onPress={() => handleSelectItem(item.id)}>
                            <Ionicons
                                name={item.selected ? "checkbox-outline" : "square-outline"}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                        <Image source={{ uri: item.uri }} style={styles.cartItemImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cartItemTitle}>{item.title}</Text>
                            <Text style={styles.cartItemPrice}>${item.price}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                                <Ionicons name="remove" size={20} color="#FFA500" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                                <Ionicons name="add" size={20} color="#FFA500" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.totalText}>${total}</Text>
                <TouchableOpacity
                    onPress={() => {
                        const selectedItems = cartItems.filter(item => item.selected);
                        navigation.navigate('Payment', { cartItems: selectedItems });
                    }}
                >
                    <Text style={{ color: '#FFC107' }}>Mua hàng</Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFC107',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'space-between',
        backgroundColor: '#FFC107',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cartItem: {
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        borderColor: '#FFA500',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityText: {
        marginHorizontal: 8,
        fontWeight: 'bold',
        color: '#333',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
