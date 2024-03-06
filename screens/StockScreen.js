import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

const StockScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates from the database
    const dbRef = ref(database, 'users/1/shops/11/products');

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
        </View>
      </View>
    </TouchableOpacity>
  );

  const navigateToStockDetails = (product) => {
    // Add navigation logic to navigate to the product details screen
    // You may also pass the product data to the details screen
  };

  const navigateToNewStock = () => {
    // Navigate to the "New Stock" screen (modal)
    navigation.navigate('NewStock');
  };

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>No products available</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.name.toString()}
          renderItem={renderStockItem}
        />
      )}

      <Button title="Create Product" onPress={navigateToNewStock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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

export default StockScreen;
