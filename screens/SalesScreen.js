import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';


const SalesScreen = ({ route }) => {
  const [sales, setSales] = useState('')
  const [products, setProducts] = useState([]); // Array to store product data
  const [selectedProduct, setSelectedProduct] = useState(''); // ID of selected product
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [paymentType, setPaymentType] = useState(''); // Default payment type
  const [profits, setProfits] = useState(''); // Array to store profits data
  const [losses, setLosses] = useState(''); // Array to store losses data
  const [isModalVisible, setModalVisible] = useState(false);

  const { userId } = route.params
  const shopId = useSelector((state) => state.shopId.shopId);
  console.log(userId,shopId)
  const paymentTypes = ['cash', 'Mpesa', 'loan']
  // Fetch product data on component mount
  useEffect(() => {
    const fetchSalesAndProducts = async () => {
      // Fetch sales data
      const salesRef = ref(database, `users/${userId}/shops/${shopId}/sales`);
      onValue(salesRef, (snapshot) => {
        const allSales = [];
        snapshot.forEach((saleSnapshot) => {
          allSales.push({ id: saleSnapshot.key, ...saleSnapshot.val() });
        });
        setSales(allSales);
      });

      // Fetch products data
      const productsRef = ref(database, `users/${userId}/shops/${shopId}/products`);
      onValue(productsRef, (snapshot) => {
        const allProducts = [];
        snapshot.forEach((productSnapshot) => {
          allProducts.push({ id: productSnapshot.key, ...productSnapshot.val() });
        });
        setProducts(allProducts);
      });
    };

    fetchSalesAndProducts();
  }, []);


  // Handle sale creation
  const handleCreateSale = async () => {
    if (!selectedProduct || !customerName || !quantity || !sellingPrice || !paymentType) {
      alert('Please fill in all fields');
      return;
    }

    const selectedProductDetails = products.find((product) => product.name === selectedProduct);
    const { stockQuantity, buyingPrice, id, name } = selectedProductDetails;

    if (quantity > parseInt(stockQuantity)) {
      alert('Insufficient stock.');
      return;
    }

    const newStockQuantity = stockQuantity - quantity;

    // Update product stock quantity
    update(ref(database, `users/${userId}/shops/${shopId}/products/${id}`), {
      stockQuantity: newStockQuantity,
    });

    // Create sale data
    const saleData = {
      productId: id,
      productName: name,
      customerName,
      quantity,
      sellingPrice,
      paymentType,
    };

    // Push sale data to database
    const salesRef = ref(database, `users/${userId}/shops/${shopId}/sales`);
    push(salesRef, saleData);

    // Calculate profit/loss
    const profitLoss = sellingPrice - buyingPrice;

    const currentDate = new Date();
    const scheduledDate = new Date();
    scheduledDate.setDate(currentDate.getDate() + 10);

    if (paymentType === 'cash' || paymentType === 'Mpesa') {
      if (profitLoss > 0) {
        // Create profit data
        const profit = {
          productName: selectedProductDetails.name,
          productBuyingPrice: selectedProductDetails.buyingPrice,
          productSellingPrice: selectedProductDetails.sellingPrice,
          actualAmountSoldFor: sellingPrice,
          profitPerQuantity: sellingPrice - selectedProductDetails.buyingPrice,
          quantitySold: quantity,
          profitAmount: profitLoss * quantity,
          customerSoldTo: customerName,
          origin: 'sales'
        };
        setProfits(profit);

        // Push profit data to database (shops/shopId/profits)
        // Assuming you have a `shops` node with a `shopId`
        const shopProfitsRef = ref(database, `users/${userId}/shops/${shopId}/profits`);
        push(shopProfitsRef, profit);
      } else if (profitLoss < 0) {
        // Create loss data
        const loss = {
          productName: selectedProductDetails.name,
          productBuyingPrice: selectedProductDetails.buyingPrice,
          productSellingPrice: selectedProductDetails.sellingPrice,
          actualAmountSoldFor: sellingPrice,
          lossPerQuantity: selectedProductDetails.buyingPrice - sellingPrice,
          quantitySold: quantity,// Use retrieved product name
          lossAmount: Math.abs(profitLoss) * parseInt(quantity), // Calculate absolute loss
          customerSoldTo: customerName,
          origin: 'sales'
        };
        setLosses(loss);
        console.log(loss)

        // Push loss data to database (shops/shopId/losses)
        const shopLossesRef = ref(database, `users/${userId}/shops/${shopId}/losses`)
        push(shopLossesRef, loss);}
    }
    if (paymentType === 'loan') {
      // Create loan data
      const loanData = {
        customerName,
        scheduleDate: scheduledDate.toString(), // Convert to string or use a proper date format
        productName: name,
        quantity: quantity,
        expectedMoney: sellingPrice * quantity,
        expectedProfit: profitLoss * quantity,
      };

      // Push loan data to database (shops/shopId/loans)
      const shopLoansRef = ref(database, `users/${userId}/shops/${shopId}/loans`);
      push(shopLoansRef, loanData);
    }


    // Clear form fields and display notification
    setSelectedProduct('');
    setCustomerName('');
    setQuantity('');
    setLosses('')
    setProfits('')
    setSellingPrice('')

    setModalVisible(false);
  }

  const cancelProductCreation = () => {
    setSelectedProduct('');
    setCustomerName('');
    setQuantity('');
    setLosses('')
    setProfits('')
    setSellingPrice('')
    setPaymentType('')

    setModalVisible(false);
  }

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text>{`Product: ${item.productName}`}</Text>
      <Text>{`Customer Name: ${item.customerName}`}</Text>
      <Text>{`Quantity: ${item.quantity}`}</Text>
      <Text>{`Selling Price: ${item.sellingPrice}`}</Text>
      <Text>{`Payment Type: ${item.paymentType}`}</Text>
    </View>
  );

  const PaymentPicker = ({ selectedValue, onValueChange, paymentTypes }) => {
    return (
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => onValueChange(value)}
          style={styles.picker}
          mode="dropdown"
        ><Picker.Item label="Select payment type" value="" style={styles.pickerPlaceholder}/>
          {paymentTypes.map((type, i) => (
            <Picker.Item key={i} label={type} value={type} />
          ))}
        </Picker>
      </View>
    );
  };

  const ProductPicker = ({ selectedValue, onValueChange, products }) => {
    return (
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => onValueChange(value)}
          style={styles.picker}
          mode='dropdown'
        >
          <Picker.Item label="Select product to be sold" value="" style={styles.pickerPlaceholder} />
          {products.map((product) => (
            <Picker.Item key={product.id} label={product.name} value={product.name} />
          ))}

        </Picker>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {sales.length === 0 ? (
        <Text style={styles.noSalesText}>No sales available</Text>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSaleItem}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>New Sale Form</Text>

          {/* Product Selection */}
          <ProductPicker
            selectedValue={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
            products={products}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor={'#888'}
            value={quantity}
            keyboardType='numeric'
            onChangeText={(text) => setQuantity(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Selling price"
            placeholderTextColor={'#888'}
            value={sellingPrice}
            keyboardType='numeric'
            onChangeText={(text) => setSellingPrice(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="customer name"
            placeholderTextColor={'#888'}
            value={customerName}
            onChangeText={(text) => setCustomerName(text)}
          />

          <PaymentPicker
            selectedValue={paymentType}
            onValueChange={(value) => setPaymentType(value)}
            paymentTypes={paymentTypes}
          />
          {/* Other input fields (Quantity, Selling Price, Customer Name, Payment Type) */}

          <Button title="Create Sale" onPress={handleCreateSale} />
          <Button title="Cancel" onPress={cancelProductCreation} />
        </View>
      </Modal>

      <Button title="Create a new sale" onPress={() => setModalVisible(true)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerPlaceholder: {
    color:"#888",
    fontSize:14,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 300
  },
  saleItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    maxWidth: 300,
    height: 40
  },

  picker: {
    flex: 1,
  }
});


export default SalesScreen
