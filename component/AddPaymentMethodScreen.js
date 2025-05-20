import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const PaymentMethodItem = ({ item, onDelete, onSetDefault }) => {
  return (
    <View style={styles.item}>
      <Text style={{ fontWeight: 'bold' }}>{item.tenPhuongThuc}</Text>
      {item.macDinh && <Text style={styles.default}>[Mặc định]</Text>}
      <View style={styles.actions}>
        {!item.macDinh && (
          <TouchableOpacity onPress={onSetDefault}>
            <Text style={styles.button}>Mặc định</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDelete}>
          <Text style={[styles.button, { color: 'red' }]}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentMethodItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  default: {
    color: 'green',
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    color: 'blue',
    marginRight: 16,
  },
});
