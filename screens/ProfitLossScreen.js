import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

const ProfitLossScreen = ({route}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'profits', title: 'Profits' },
    { key: 'losses', title: 'Losses' },
    { key: 'loans', title: 'Loans' },
  ]);

  const { userId } = route.params
  const shopId = useSelector((state) => state.shopId.shopId);

  const [profits, setProfits] = useState([]);
  const [losses, setLosses] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchProfitsAndLosses = async () => {
      // Fetch profits data
      const profitsRef = ref(database, `users/${userId}/shops/${shopId}/profits`);
      onValue(profitsRef, (snapshot) => {
        const allProfits = [];
        snapshot.forEach((profitSnapshot) => {
          allProfits.push({ id: profitSnapshot.key, ...profitSnapshot.val() });
        });
        setProfits(allProfits);
      });

      // Fetch losses data
      const lossesRef = ref(database, `users/${userId}/shops/${shopId}/losses`);
      onValue(lossesRef, (snapshot) => {
        const allLosses = [];
        snapshot.forEach((lossSnapshot) => {
          allLosses.push({ id: lossSnapshot.key, ...lossSnapshot.val() });
        });
        setLosses(allLosses);
      });
    };
    const fetchLoans = async () => {

      const loansRef = ref(database, `users/${userId}/shops/${shopId}/loans`);
      onValue(loansRef, (snapshot) => {
        const allLoans = [];
        snapshot.forEach((loanSnapshot) => {
          allLoans.push({ id: loanSnapshot.key, ...loanSnapshot.val() });
        });
        setLoans(allLoans);
      });
    }

    fetchLoans()
    fetchProfitsAndLosses();
  }, []);

  const renderProfitLossItem = ({ item }) => (
    <View style={styles.profitLossItem}>
      {item.origin == 'sales' &&
        <>
          <Text>{`Product Sold: ${item.productName}`}</Text>
          <Text>{`Product Selling Price: ${item.productSellingPrice}`}</Text>
          <Text>{`Product Buying Price: ${item.productBuyingPrice}`}</Text>
          <Text>{`Amount product was sold for: ${item.actualAmountSoldFor}`}</Text>
          <Text>{`${item.profitPerQuantity ? 'Profit per quantity' : 'Loss per quantity'} : ${item.profitPerQuantity || item.lossPerQuantity}`}</Text>
          <Text>{`Quantity Sold: ${item.quantitySold}`}</Text>
          <Text>{`${item.profitAmount ? 'Profit' : 'Loss'} Amount: ${item.profitAmount || item.lossAmount}`}</Text>
          <Text>{`Customer Name: ${item.customerSoldTo}`}</Text>
          <Text>{`Origin: ${item.origin}`}</Text>
        </>
      }
      {item.origin == 'appreciation' &&
        <>
          <Text>{`Product Appreciated: ${item.productAppreciated}`}</Text>
          <Text>{`Stock quantity Appreciated: ${item.stockAppreciated}`}</Text>
          <Text>{`Previous buying price: ${item.previousBuyingPrice}`}</Text>
          <Text>{`Current buying price: ${item.currentBuyingPrice}`}</Text>
          <Text>{`Profit per quantity: ${parseInt(item.currentBuyingPrice - item.previousBuyingPrice)}`}</Text>
          <Text>{`Total Profit: ${item.totalProfit}`}</Text>
          <Text>{`Origin: ${item.origin}`}</Text>
        </>
      }

    </View>
  );

  const renderLoanItem = ({ item }) => (
    <View style={styles.profitLossItem}>
      <Text>{`Customer: ${item.customerName}`}</Text>
      <Text>{`Product Sold: ${item.productName}`}</Text>
      <Text>{`Deadline of payment: ${item.scheduleDate}`}</Text>
      <Text>{`Quantity sold: ${item.quantity}`}</Text>
      <Text>{`Expected Money: ${item.expectedMoney}`}</Text>
      <Text>{`Expected Profit: ${item.expectedProfit}`}</Text>
    </View>
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'profits':
        return (
          <FlatList
            data={profits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProfitLossItem}
          />
        );
      case 'losses':
        return (
          <FlatList
            data={losses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProfitLossItem}
          />
        );
      case 'loans':
        return (
          <FlatList
            data={loans}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLoanItem}
          />

        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 300 }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3498db' }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: '#333' }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profitLossItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
});

export default ProfitLossScreen;
