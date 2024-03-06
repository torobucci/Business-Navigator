import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from '../firebaseConfig';

const NewProductScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [measuringUnit, setMeasuringUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [estimatedProfit, setEstimatedProfit] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleImagePicker = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  const handleSaveNewProduct = async () => {
    // Validate form inputs
    if (!productName || !quantity || !buyingPrice || !sellingPrice || !measuringUnit ||
        !expiryDate || !estimatedProfit || !category || !subCategory || !image) {
      alert('Please fill in all fields.');
      return;
    }

    // Upload the image to Firebase Storage
    const response = await fetch(image);
    const blob = await response.blob();
    const imageName = `product_${Date.now()}.jpg`;
    const storageRef = storage.ref().child(`images/${imageName}`);

    try {
      await storageRef.put(blob);
      const imageUrl = await storageRef.getDownloadURL();

      // Insert the new product into the database
      const productsRef = database.ref('users/1/shops/11/products');

      const newProduct = {
        name: productName,
        quantity: parseInt(quantity, 10),
        buyingPrice: parseFloat(buyingPrice),
        sellingPrice: parseFloat(sellingPrice),
        measuringUnit: measuringUnit,
        expiryDate: expiryDate, // You may want to parse this date string
        estimatedProfit: parseFloat(estimatedProfit),
        category: category,
        subCategory: subCategory,
        imageUrl: imageUrl, // Add the imageUrl to the product data
        // Add other properties based on your data model
      };

      productsRef.push(newProduct)
        .then(() => {
          // Clear form fields after saving
          setProductName('');
          setQuantity('');
          setBuyingPrice('');
          setSellingPrice('');
          setMeasuringUnit('');
          setExpiryDate('');
          setEstimatedProfit('');
          setCategory('');
          setSubCategory('');
          setImage(null);

          // Navigate back or close the modal after saving
          navigation.goBack();
        })
        .catch((error) => {
          console.error('Error saving new product:', error);
          alert('Error saving new product.');
        });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Product Screen</Text>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <Button title="Select Image" onPress={handleImagePicker} />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={(text) => setQuantity(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Buying Price"
        keyboardType="numeric"
        value={buyingPrice}
        onChangeText={(text) => setBuyingPrice(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        keyboardType="numeric"
        value={sellingPrice}
        onChangeText={(text) => setSellingPrice(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Measuring Unit"
        value={measuringUnit}
        onChangeText={(text) => setMeasuringUnit(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date"
        value={expiryDate}
        onChangeText={(text) => setExpiryDate(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estimated Profit"
        keyboardType="numeric"
        value={estimatedProfit}
        onChangeText={(text) => setEstimatedProfit(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={(text) => setCategory(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sub Category"
        value={subCategory}
        onChangeText={(text) => setSubCategory(text)}
      />
      <Button title="Save New Product" onPress={handleSaveNewProduct} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default NewProductScreen;
