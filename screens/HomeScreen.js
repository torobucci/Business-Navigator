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
  const [showCreateOptions, setShowCreateOptions] = useState(false);
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
    backgroundColor: '#1DA1F2',
    backgroundGradientFrom: '#A9D0F5',
    backgroundGradientTo: '#87CEFA',
    decimalPlaces: 2,
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

  sales ? sales.forEach((sale) => {
    const { productName, quantity } = sale;

    if (productSalesCountMap[productName]) {
      productSalesCountMap[productName] += parseInt(quantity);
    } else {
      productSalesCountMap[productName] = parseInt(quantity);
    }
  }) : '';

  const salesData = {
    labels: Object.keys(productSalesCountMap),
    datasets: [
      {
        data: Object.values(productSalesCountMap),
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const productProfitsCountMap = {};
  profits ? profits.forEach((profit) => {
    if (profit.origin == 'sales') {
      const { productName, profitAmount } = profit;


      if (productProfitsCountMap[productName]) {
        productProfitsCountMap[productName] += profitAmount;
      } else {
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

          {sales.length > 0 && profits.length > 0 ? <>
            <Text>Product with the most sales</Text>
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
            <Text>Product with the most profit</Text>
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
      </ScrollView>
      {showCreateOptions && (
        <View style={styles.createOptionsContainer}>
          <TouchableOpacity onPress={() => { setModalVisible(true); setShowCreateOptions(false) }}>
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
        <NewShop userId={userId} setModalVisible={setModalVisible} />
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
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

