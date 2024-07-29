import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal, TextInput, FlatList, Alert } from 'react-native';
import { ref, onValue, update, push } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';


const ExpensesScreen = ({ route }) => {
  const [expenses, setExpenses] = useState('')
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isStockExpense, setIsStockExpense] = useState(false);
  const [updateStock, setUpdateStock] = useState(false);
  const [productName, setProductName] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')


  const { userId } = route.params
  const shopId = useSelector((state) => state.shopId.shopId);

  const expenseTypes = ['stock', 'salaries', 'rent', 'other']

  const paymentTypes = ['cash', 'Mpesa', 'loan']

  useEffect(() => {
    const fetchExpensesAndProducts = async () => {
      // Fetch expenses data
      const expensesRef = ref(database, `users/${userId}/shops/${shopId}/expenses`);
      onValue(expensesRef, (snapshot) => {
        const allExpenses = [];
        snapshot.forEach((expenseSnapshot) => {
          allExpenses.push({ id: expenseSnapshot.key, ...expenseSnapshot.val() });
        });
        setExpenses(allExpenses);
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

    fetchExpensesAndProducts();
  }, []);

  const updateIsStockExpense = (value) => {
    setType(value)
    if (value == 'stock') {
      setIsStockExpense(true)
    }
    else {
      setIsStockExpense(false)
    }
  }
  const createTwoButtonAlert = () => {
    Alert.alert(
      "Update Prices",
      "Would you like to update the buying and selling prices?",
      [
        {
          text: "Yes",
          onPress: () => setUpdateStock(true),
          style: "cancel"
        },
        { text: "No", onPress: () => setUpdateStock(false) }
      ],
      { cancelable: false }
    );
  };

  // Handle expense creation
  const handleCreateExpense = async () => {
    if (isStockExpense) {
      if (updateStock) {
        if (!name || !description || !amount || !type || !quantity || !sellingPrice || !buyingPrice || !selectedProduct) {
          alert('Please fill in all details')
          return;
        }
      }
      else {
        if (!name || !description || !amount || !type || !quantity || !selectedProduct) {
          alert('Please fill in all details');
          return;
        }
      }
    }

    if (!isStockExpense) {
      if (!name || !description || !amount || !type) {
        alert('Please fill in all details')
        return;
      }
    }


    const expensesRef = ref(database, `users/${userId}/shops/${shopId}/expenses`);
    const profitsRef = ref(database, `users/${userId}/shops/${shopId}/profits`);
    if (type == 'stock') {
      const productToBeUpdated = products.find((product) => product.name == selectedProduct)
      update(ref(database, `users/${userId}/shops/${shopId}/products/${productToBeUpdated.id}`), {
        stockQuantity: parseInt(productToBeUpdated.stockQuantity) + parseInt(quantity),
      });

      if(buyingPrice && sellingPrice){
          if(buyingPrice > productToBeUpdated.buyingPrice){
            const profit = {
               productAppreciated: selectedProduct,
               stockAppreciated: productToBeUpdated.stockQuantity,
               previousBuyingPrice: productToBeUpdated.buyingPrice,
               currentBuyingPrice: buyingPrice,
               totalProfit: (buyingPrice - productToBeUpdated.buyingPrice)* productToBeUpdated.stockQuantity,
               origin: 'appreciation'
              }
             push(profitsRef,profit)

             update(ref(database, `users/${userId}/shops/${shopId}/products/${productToBeUpdated.id}`), {
              buyingPrice: buyingPrice,
              sellingPrice: sellingPrice
            });
          }
      }

      const newExpense = {
        name,
        description,
        type,
        amount,
        paymentType,
        productBought: selectedProduct,
        quantityBought: quantity,
      }
      push(expensesRef, newExpense)
    }
    else {
      const newExpense = {
        name,
        description,
        type,
        amount,
        paymentType
      }
      push(expensesRef, newExpense)
    }

    // Clear form fields and display notification
    setName('');
    setPaymentType('');
    setQuantity('');
    setType('')
    setBuyingPrice('')
    setSellingPrice('')
    setSelectedProduct('')
    setAmount('')
    setDescription('')

    setModalVisible(false);
  }

  const cancelExpenseCreation = () => {
    setName('');
    setPaymentType('');
    setQuantity('');
    setType('')
    setBuyingPrice('')
    setSellingPrice('')
    setSelectedProduct('')
    setAmount('')
    setDescription('')
    setModalVisible(false);
  }

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text>{`Expense Name: ${item.name}`}</Text>
      <Text>{`Expense Type: ${item.type}`}</Text>
      <Text>{`Description: ${item.description}`}</Text>
      <Text>{`Amount: ${item.amount}`}</Text>
      <Text>{`Payment Type: ${item.paymentType}`}</Text>
      {item.productBought ? <Text>{`Product Bought: ${item.productBought}`}</Text> : ''}
      {item.quantityBought ? <Text>{`Quantity of Product bought: ${item.quantityBought}`}</Text> : ''}
    </View>
  );

  const ExpenseTypePicker = ({ selectedValue, onValueChange, expenseTypes }) => {
    return (
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => {
            onValueChange(value)
            if (value == 'stock') {
              createTwoButtonAlert()
            }
          }}
          style={styles.picker}
          mode="dropdown"
        ><Picker.Item label="Select expense type" value="" style={styles.pickerPlaceholder} />
          {expenseTypes.map((type, i) => (
            <Picker.Item key={i} label={type} value={type} />
          ))}
        </Picker>
      </View>
    );
  };
  const PaymentPicker = ({ selectedValue, onValueChange, paymentTypes }) => {
    return (
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => onValueChange(value)}
          style={styles.picker}
          mode="dropdown"
        ><Picker.Item label="Select payment type" value="" style={styles.pickerPlaceholder} />
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
          <Picker.Item label="Select product to be bought" value="" style={styles.pickerPlaceholder} />
          {products.map((product) => (
            <Picker.Item key={product.id} label={product.name} value={product.name} />
          ))}

        </Picker>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {expenses.length === 0 ? (
        <Text style={styles.noSalesText}>No expenses available</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExpenseItem}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>New Expense Form</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <ExpenseTypePicker
            selectedValue={type}
            onValueChange={(value) => updateIsStockExpense(value)}
            expenseTypes={expenseTypes}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
          />
          <PaymentPicker
            selectedValue={paymentType}
            onValueChange={(value) => setPaymentType(value)}
            paymentTypes={paymentTypes}
          />
          {isStockExpense && (
            <>
              <ProductPicker
                selectedValue={selectedProduct}
                onValueChange={(value) => setSelectedProduct(value)}
                products={products}
              />
              <TextInput
                placeholder="Quantity bought"
                value={quantity}
                onChangeText={(text) => setQuantity(text)}
                keyboardType="numeric"
              />
            </>
          )}
          {isStockExpense && updateStock && (
            <>
              <TextInput
                placeholder="Buying Price"
                value={buyingPrice}
                onChangeText={(text) => setBuyingPrice(text)}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Selling Price"
                value={sellingPrice}
                onChangeText={(text) => setSellingPrice(text)}
                keyboardType="numeric"
              />
            </>
          )}

          <Button title="Create Expense" onPress={handleCreateExpense} />
          <Button title="Cancel" onPress={cancelExpenseCreation} />
        </View>
      </Modal>

      <Button title="Create a new Expense" onPress={() => setModalVisible(true)} />
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
    color: "#888",
    fontSize: 14,
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
  expenseItem: {
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


export default ExpensesScreen
