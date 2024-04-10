import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/FontAwesome6';
import { useSelector } from 'react-redux';

const CustomHeader = ({ shopId, title }) => {
  const navigation = useNavigation();
  const shops = useSelector((state) => state.shopId.shops)
  const userName = useSelector((state) => state.users.userName)

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer}>
        <Icon name="bars" size={24} color="black" style={styles.menuIcon} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        {shops.length > 0 ? <>
          <Text style={styles.titleHeader}>{shops.find((shop) => shop.id == shopId).name} <Icon name="shop" size={15} color={'#1DA1F2'} /></Text>
        </>
          : ''}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text>{userName} <Icon name="user" size={16} /></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  titleHeader: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default CustomHeader;

