import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAuthenticated } from '../../reduxFolder/UsersSlice';
import { setShopId } from '../../reduxFolder/ShopIdSlice';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


const CustomDrawerContent = ({ navigation }) => {
  const [value, setValue] = useState('');
  const shops = useSelector((state) => state.shopId.shops)
  const shopId = useSelector((state) => state.shopId.shopId)
  const dispatch = useDispatch()



  const handleShopSelection = (shopId) => {
    // Handle shop selection logic here
    dispatch(setShopId(shopId));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(setUserAuthenticated(false))
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.shopDropdown}>
        <Text style={styles.header}>{shops.length > 0 ? shops.find((shop) => shop.id == shopId).name : ''}</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={shops}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select shop to be displayed"
          value={value}
          onChange={item => {
            setValue(item.name);
            handleShopSelection(item.id)
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
          renderItem={renderItem}
        />

        <Button style={styles.logoutButton} title="Logout" onPress={handleLogout} color="#e74c3c" />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header:{
    fontSize:30
  },
  shopDropdown: {
    padding: 10,
    display:'flex',
    flexDirection:'column',
    gap:20
  },
  logoutButton: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    width: 1,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    borderTopColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CustomDrawerContent;
