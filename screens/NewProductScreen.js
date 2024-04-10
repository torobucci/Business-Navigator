import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { push, ref as databaseRef } from 'firebase/database';
import { useSelector } from 'react-redux';

const NewProductScreen = ({ route, isModalVisible, setIsModalVisible }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [measuringUnit, setMeasuringUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const { userId } = route.params

  const shopId = useSelector((state) => state.shopId.shopId);

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

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleImageChange = (event) => {
    // Get the selected file from the input element
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Read the selected file as a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSaveNewProduct = async () => {
    // Validate form inputs
    if (!productName || !quantity || !buyingPrice || !sellingPrice || !measuringUnit ||
      !expiryDate || !category || !subCategory || !image || !stockQuantity) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const imageName = `product_${Date.now()}.jpg`;
      const storageRef = ref(storage, `images/${imageName}`);
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Set the imageUrl state
      setImageUrl(downloadURL);

      // Insert the new product into the database
      push(databaseRef(database, `users/${userId}/shops/${shopId}/products`), {
        name: productName,
        quantity: parseInt(quantity, 10),
        buyingPrice: parseFloat(buyingPrice),
        sellingPrice: parseFloat(sellingPrice),
        measuringUnit: measuringUnit,
        expiryDate: expiryDate, // You may want to parse this date string
        estimatedProfit: parseFloat(sellingPrice - buyingPrice),
        category: category,
        subCategory: subCategory,
        imageUrl: downloadURL,
        stockQuantity: stockQuantity// Use the obtained downloadURL directly
      }).then(() => {
        // Clear form fields after saving
        setProductName('');
        setQuantity('');
        setBuyingPrice('');
        setSellingPrice('');
        setMeasuringUnit('');
        setExpiryDate('');
        setCategory('');
        setSubCategory('');
        setImage(null);

        // Navigate back or close the modal after saving
        // navigation.goBack();
        toggleModal()
      }).catch((error) => {
        console.error('Error saving new product:', error);
        alert('Error saving new product.');
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    }
  };
  const toggleModal = () => {
    // Call the function from props to update the state in the parent component
    setIsModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Product Screen</Text>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      {Platform.OS !== 'web' ? (
        <Button title="Select Image" onPress={handleImagePicker} />
      ) : (
        <input type="file" accept="image/*" onChange={handleImageChange} />
      )}
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
      <TextInput
        style={styles.input}
        placeholder="Stock Quantity"
        keyboardType="numeric"
        value={stockQuantity}
        onChangeText={(text) => setStockQuantity(text)}
      />
      <Text>{isModalVisible}</Text>
     <Button title="Create new Product" onPress={handleSaveNewProduct} />
     <Button title="Cancel" onPress={toggleModal} />
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
