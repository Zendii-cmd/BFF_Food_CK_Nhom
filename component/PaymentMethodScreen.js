import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { authApi } from '../API/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../Contexts/ThemeProvider';
import { lightTheme, darkTheme } from '../Contexts/theme';

const PaymentMethodsScreen = () => {
  const [methods, setMethods] = useState([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMethods);
    return unsubscribe;
  }, [navigation]);

  const fetchMethods = async () => {
    try {
      const data = await authApi.getPaymentMethods();
      setMethods(data.data);
    } catch (err) {
      console.error('Lỗi khi fetch phương thức:', err?.response?.data || err.message);
      Alert.alert('Lỗi', 'Không thể tải phương thức thanh toán');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApi.deletePaymentMethod(id);
            fetchMethods();
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id) => {
    try {
      await authApi.setDefaultPaymentMethod(id);
      fetchMethods();
    } catch {
      Alert.alert('Lỗi', 'Không thể đặt mặc định');
    }
  };

  const logos = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    MasterCard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    Momo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    PayPal: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  };

  const renderItem = ({ item }) => {
    const tenHienThi = item.tenPhuongThuc || item.loai?.toUpperCase();

    return (
      <View style={[styles.methodItem, { backgroundColor: theme.card }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.methodName, { color: theme.text }]}>
            {tenHienThi}{' '}
            {item.macDinh && <Text style={{ color: 'green' }}>(Mặc định)</Text>}
          </Text>
          {item.thongTinThe && (
            <>
              <Text style={{ color: theme.text }}>Chủ thẻ: {item.thongTinThe.tenTrenThe}</Text>
              <Text style={{ color: theme.text }}>Số thẻ: {item.thongTinThe.soThe}</Text>
              <Text style={{ color: theme.text }}>Hết hạn: {item.thongTinThe.ngayHetHan}</Text>
              <Text style={{ color: theme.text }}>CVV: ***</Text>
            </>
          )}
        </View>

        {logos[item.tenPhuongThuc] && (
          <Image
            source={{ uri: logos[item.tenPhuongThuc] }}
            style={styles.logo}
          />
        )}

        <View style={styles.actionIcons}>
          {!item.macDinh && (
            <TouchableOpacity
              onPress={() => handleSetDefault(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="star-outline" size={22} color="orange" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('AddEditPaymentMethod', { item })}
            style={styles.iconButton}
          >
            <Ionicons name="create-outline" size={22} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Phương thức thanh toán</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddEditPaymentMethod')}
          style={[styles.addButtonHeader, { backgroundColor: '#FFA500' }]}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={methods}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButtonHeader: {
    borderRadius: 20,
    padding: 6,
  },
  methodItem: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 8,
  },
  iconButton: {
    padding: 6,
  },
});

export default PaymentMethodsScreen;
