import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Alert,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import axios from 'axios';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // For showing the modal

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const response = await axios.get('http://192.168.1.237:5000/items/');
            setItems(response.data);
        } catch (error) {
            Alert.alert('Error', 'Could not load items');
            console.error(error);
        }
    };

    const addItem = async () => {
        if (!name || !description) {
            Alert.alert('Error', 'Please enter both name and description');
            return;
        }

        try {
            const newItem = { name, description };
            await axios.post('http://192.168.1.237:5000/items/', newItem);
            Alert.alert('Notice', 'Item added successfully');
            loadItems();
            resetForm();
            setIsModalVisible(false); // Close the modal after adding
        } catch (error) {
            Alert.alert('Error', 'Could not add item');
            console.error(error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://192.168.1.237:5000/items/${id}`);
            Alert.alert('Notice', 'Item deleted successfully');
            loadItems();
        } catch (error) {
            Alert.alert('Error', 'Could not delete item');
            console.error(error);
        }
    };

    const startEditing = (item) => {
        setEditingId(item._id);
        setName(item.name);
        setDescription(item.description);
    };

    const updateItem = async () => {
        if (!name || !description) {
            Alert.alert('Error', 'Please enter both name and description');
            return;
        }

        try {
            const updatedItem = { name, description };
            await axios.put(`http://192.168.1.237:5000/items/${editingId}`, updatedItem);
            Alert.alert('Notice', 'Item updated successfully');
            loadItems();
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Could not update item');
            console.error(error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setEditingId(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.profileCard} key={item._id}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9gmoq5WsD24WhoJihBy4ildMOzEE_JcJgBw&s' }}
                    style={styles.avatar}
                />
                <Text style={styles.profileName}>{item.name}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Mô tả:</Text>
                <Text style={styles.infoValue}>{item.description}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => startEditing(item)}>
                    <Text style={styles.buttonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item._id)}>
                    <Text style={styles.buttonText}>Xoá</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}> {/* Wrap your main view with SafeAreaView */}
            <View style={styles.header}>
                <Text style={styles.title}>Danh Sách Mục</Text>
                {/* Button to open the modal */}
                <TouchableOpacity style={styles.addItemButton} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Nhập thêm mục</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for adding a new item */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thêm Mới Mục</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mô tả"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <View style={styles.modalButtonGroup}>
                            <TouchableOpacity style={styles.saveButton} onPress={addItem}>
                                <Text style={styles.buttonText}>Lưu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={items}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                style={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    header: {
        backgroundColor: '#2980b9',
        paddingTop: 50,
        paddingBottom: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    addItemButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 5,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#2980b9',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
        color: '#34495e',
    },
    infoSection: {
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#7f8c8d',
    },
    infoValue: {
        color: '#34495e',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    cancelButton: {
        backgroundColor: '#bdc3c7',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
    },
});

export default ItemList;
