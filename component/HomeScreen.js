// HomeScreen.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BottomTab from './BottomTab'; // chỉnh lại đúng đường dẫn nếu cần
import { useTheme } from '../Contexts/ThemeProvider'; // điều chỉnh đường dẫn nếu khác
import { lightTheme, darkTheme } from '../Contexts/theme'; // điều chỉnh đường dẫn nếu cần
import { authApi } from '../API/auth';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getThemeColor = (lightColor, darkColor) => (isDarkMode ? darkColor : lightColor);

const bannerImages = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60' },
  { id: '2', uri: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '3', uri: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '4', uri: 'https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '5', uri: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '6', uri: 'https://media.istockphoto.com/id/1457889029/vi/anh/nh%C3%B3m-th%E1%BB%B1c-ph%E1%BA%A9m-c%C3%B3-h%C3%A0m-l%C6%B0%E1%BB%A3ng-ch%E1%BA%A5t-x%C6%A1-cao-%C4%91%C6%B0%E1%BB%A3c-s%E1%BA%AFp-x%E1%BA%BFp-c%E1%BA%A1nh-nhau.jpg?b=1&s=612x612&w=0&k=20&c=EWK9PSlhwM0_OphSA6MscW5bhLR24MrZH0bnH0WpZw8=' },
];

const adBanner = {
  bigBanner: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=600',
  smallBanner1: 'https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=600',
  smallBanner2: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60',
};

export default function HomeScreen() {
  const scrollRef = useRef();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]); // <-- Dữ liệu món ăn từ API
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextBanner = (currentBanner + 1) % bannerImages.length;
      scrollRef.current.scrollTo({ x: nextBanner * width, animated: true });
      setCurrentBanner(nextBanner);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentBanner]);

  // GỌI API lấy danh sách món ăn
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await authApi.getAll({ page: 1, limit: 10 });
        setProducts(result);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>BFF FOOD</Text>
        <View style={[styles.searchBox, { backgroundColor: theme.input }]}>
          <Ionicons name="search-outline" size={20} color={theme.placeholder} />
          <TextInput
            placeholder="Tìm kiếm món ăn, hoặc cửa hàng"
            placeholderTextColor={theme.placeholder}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Banner ngang */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
        >
          {bannerImages.map(b => (
            <Image
              key={b.id}
              source={{ uri: b.uri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Banner quảng cáo */}
        <View style={styles.adContainer}>
          <TouchableOpacity style={styles.bigAd}>
            <Image source={{ uri: adBanner.bigBanner }} style={styles.bigAdImage} />
          </TouchableOpacity>
          <View style={styles.smallAds}>
            <TouchableOpacity style={styles.smallAd}>
              <Image source={{ uri: adBanner.smallBanner1 }} style={styles.smallAdImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallAd}>
              <Image source={{ uri: adBanner.smallBanner2 }} style={styles.smallAdImage} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Large product cards */}
        <View style={styles.cardGrid}>
          {Array.isArray(products) && products.slice(0, 10).map(item => (
            <TouchableOpacity key={item._id} 
                style={[styles.largeCard, 
                { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('ChiTietSanPham', { id: item._id })}>
              <Image source={{ uri: item.hinhAnh }} style={styles.largeCardImage} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.tenSanPham}</Text>
              <Text style={[styles.cardPrice, { color: theme.text }]}>{item.gia?.toLocaleString()}₫</Text>
            </TouchableOpacity>
          ))}
        </View>


      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFC107' },
  header: { padding: 16, backgroundColor: '#FFC107' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  searchBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', paddingHorizontal: 12, height: 40, marginTop: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  bannerContainer: { marginTop: 16 },
  bannerImage: { width: width, height: 180 },
  adContainer: { flexDirection: 'row', marginTop: 16, paddingHorizontal: 16 },
  bigAd: { flex: 2, marginRight: 8 },
  bigAdImage: { width: '100%', height: 180, borderRadius: 12 },
  smallAds: { flex: 1, justifyContent: 'space-between' },
  smallAd: { height: 85 },
  smallAdImage: { width: '100%', height: '100%', borderRadius: 12 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16 },
  largeCard: { backgroundColor: '#fff', borderRadius: 12, width: (width - 48) / 2, padding: 8, marginBottom: 16 },
  largeCardImage: { width: '100%', height: 180, borderRadius: 12 },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: '600' },
  cardPrice: { fontSize: 14, marginTop: 4 },
  cardBuy: { color: '#FFA500', marginTop: 4, fontWeight: 'bold' },
  tabBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopColor: '#ddd', borderTopWidth: 1 },
});
