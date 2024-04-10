import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import Modal from 'react-native-modal';
import { BlurView } from "expo-blur";
import NewProductScreen from './NewProductScreen';
import { useSelector } from 'react-redux';

const ProductScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { userId } = route.params
  const shopId = useSelector((state) => state.shopId.shopId);

  useEffect(() => {
    // Subscribe to real-time updates from the database
    const dbRef = ref(database, `users/${userId}/shops/${shopId}/products`);

    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        const productData = Object.values(snapshot.val());
        setProducts(productData);
      } else {
        setProducts([]);
      }
    };

    onValue(dbRef, handleData);

    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      onValue(dbRef, handleData);
    };
  }, []);

  const renderStockItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToStockDetails(item)}>
      <View style={styles.stockItem}>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.productImage} />}
        <Text style={styles.stockName}>{`Name: ${item.name}`}</Text>
        <View>
          <Text style={styles.stockQuantity}>{`Category: ${item.category}`}</Text>
          <Text style={styles.stockQuantity}>{`Sub Category: ${item.subCategory}`}</Text>
        </View>
        <View>
          <Text style={styles.stockQuantity}>{`Buying Price: ${item.buyingPrice}`}</Text>
          <Text style={styles.stockQuantity}>{`Selling Price: ${item.sellingPrice}`}</Text>
          <Text style={styles.stockQuantity}>{`Available Stock: ${item.stockQuantity}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const navigateToStockDetails = (product) => {
    // Add navigation logic to navigate to the product details screen
    // You may also pass the product data to the details screen
  };

  const navigateToNewProduct = () => {
    // Navigate to the "New Stock" screen (modal)
    navigation.navigate('NewProduct');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>No products available</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.name}
          renderItem={renderStockItem}
        />
      )}
      <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
        <BlurView intensity={100} style={StyleSheet.absoluteFill}>
          <NewProductScreen isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}></NewProductScreen>
        </BlurView>
      </Modal>
      <Button title="Create Product" onPress={toggleModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  blurContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stockItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  stockName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stockQuantity: {
    fontSize: 14,
    color: '#888',
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProductScreen;
