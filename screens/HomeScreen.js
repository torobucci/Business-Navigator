import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from "react-native-chart-kit";
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShops } from '../reduxFolder/ShopIdSlice';
import NewShop from './child-components/NewShop';

const HomeScreen = ({ route }) => {
  const [sales, setSales] = useState('')
  const [profits, setProfits] = useState('')
  const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]
  const [showCreateOptions, setShowCreateOptions] = useState(false); // State to control the visibility of creation options
  const [modalVisible, setModalVisible] = useState(false);
  const handleFloatingButtonClick = () => {
    setShowCreateOptions(!showCreateOptions);
  };

  const { userId } = route.params
  const dispatch = useDispatch();

  function getCharacter(index) {
    return hexCharacters[index]
  }

  function generateNewColor() {
    let hexColorRep = "#"

    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(Math.random() * hexCharacters.length)
      hexColorRep += getCharacter(randomPosition)
    }

    return hexColorRep
  }
  const chartConfig = {
    backgroundColor: '#1DA1F2', // Twitter blue bird color
    backgroundGradientFrom: '#A9D0F5', // Light blue gradient start
    backgroundGradientTo: '#87CEFA', // Light blue gradient end
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
  }
  const screenWidth = Dimensions.get("window").width;

  const shopId = useSelector((state) => state.shopId.shopId);
  const shops = useSelector((state) => state.shopId.shops);

  useEffect(() => {
    dispatch(fetchShops(userId, database, onValue, ref));

  }, [dispatch]);

  useEffect(() => {
    fetchSales(shopId)
    fetchProfits(shopId)
  }, [shopId])

  const fetchSales = async (shopId) => {
    const salesRef = ref(database, `users/${userId}/shops/${shopId}/sales`);

    onValue(salesRef, (snapshot) => {
      const allSales = [];
      snapshot.forEach((saleSnapshot) => {
        allSales.push({ id: saleSnapshot.key, ...saleSnapshot.val() });
      });
      setSales(allSales);
    });
  }
  const fetchProfits = async (shopId) => {
    const profitsRef = ref(database, `users/${userId}/shops/${shopId}/profits`);
    onValue(profitsRef, (snapshot) => {
      const allProfits = [];
      snapshot.forEach((profitSnapshot) => {
        allProfits.push({ id: profitSnapshot.key, ...profitSnapshot.val() });
      });
      setProfits(allProfits);
    });
  }

  const productSalesCountMap = {};
  // Iterate over each sale in the saleData array
  sales ? sales.forEach((sale) => {
    const { productName, quantity } = sale;

    // If productId exists in the map, add the quantity to the existing count
    if (productSalesCountMap[productName]) {
      productSalesCountMap[productName] += quantity;
    } else {
      // If productId does not exist in the map, initialize the count with quantity
      productSalesCountMap[productName] = quantity;
    }
  }) : '';
  const salesData = {
    labels: Object.keys(productSalesCountMap),
    datasets: [
      {
        data: Object.values(productSalesCountMap),
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2 // optional
      }
    ],
  };

  const productProfitsCountMap = {};
  profits ? profits.forEach((profit) => {
    if (profit.origin == 'sales') {
      const { productName, profitAmount } = profit;

      // If productId exists in the map, add the quantity to the existing count
      if (productProfitsCountMap[productName]) {
        productProfitsCountMap[productName] += profitAmount;
      } else {
        // If productId does not exist in the map, initialize the count with quantity
        productProfitsCountMap[productName] = profitAmount;
      }
    }
  }) : '';
  const profitsData = []
  Object.keys(productProfitsCountMap).forEach(productName => {
    const productDetails = {
      name: productName,
      profitAmount: productProfitsCountMap[productName],
      color: generateNewColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
    profitsData.push(productDetails)
  })

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text>Welcome to Home screen {sales.length}</Text>
          {sales.length > 0 && profits.length > 0 ? <>
            <LineChart
              data={salesData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.lineChart}
              bezierstyle={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
            <PieChart
              data={profitsData}
              width={400}
              height={220}
              chartConfig={chartConfig}
              accessor={"profitAmount"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 50]}
              absolute
              style={styles.lineChart}
            />
          </> : <Text>{shops.length == 0 ? "You Don't have any shops, Create one" : `You don't have any data in ${shops.find((shop) => shop.id == shopId).name} shop`}</Text>
          }

        </View>
        {/* Show/hide creation options */}

        {/* Floating button */}

      </ScrollView>
      {showCreateOptions && (
          <View style={styles.createOptionsContainer}>
            {/* Your creation options */}
            <TouchableOpacity onPress={() =>{ setModalVisible(true); setShowCreateOptions(false)} }>
              <Text>Create Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFloatingButtonClick}>
              <Text style={styles.createOption}>x</Text>
            </TouchableOpacity>
          </View>
        )}
      <TouchableOpacity style={styles.floatingButton} onPress={handleFloatingButtonClick}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <NewShop userId={userId} setModalVisible={setModalVisible}/>
      </Modal>
    </>
  );
}
  ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineChart: {
    margin: 20,
    padding: 5,
    borderRadius: 5
  },
  createOptionsContainer: {
    position: 'absolute',
    bottom: 100, // Adjust as needed
    right: 20, // Adjust as needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.25, // Shadow for iOS
    shadowRadius: 3.84, // Shadow for iOS
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Adjust as needed
    right: 20, // Adjust as needed
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.25, // Shadow for iOS
    shadowRadius: 3.84, // Shadow for iOS
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 30,
  },
  createOption: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#1DA1F2',
  },
});

export default HomeScreen;

