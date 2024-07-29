import { useState } from "react"
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { ref, push } from 'firebase/database';
import { database } from "../../firebaseConfig";

const NewShop = ({userId, setModalVisible}) => {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const handleCreateShop = async () => {
        if (!name || !category ) {
          alert('Please fill in all fields');
          return;
        }

        const shopData = {
          name,
          category,
        };

        // Push sale data to database
        const shopRef = ref(database, `users/${userId}/shops`);
        push(shopRef, shopData);


        setName('');
        setCategory('');
        setModalVisible(false);
      }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create a shop</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={'#888'}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Category of your shop"
                placeholderTextColor={'#888'}
                value={category}
                onChangeText={(text) => setCategory(text)}
            />

            <Button title="Create Shop" onPress={handleCreateShop} />
            <Button title="Cancel" onPress={()=>setModalVisible(false)} />
        </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'transparent',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      width: '80%',
      maxHeight:400,
      maxWidth: 400,
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      elevation: 3,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
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
  });


  export default NewShop

