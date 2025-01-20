import { Text, View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { buyedStyles } from './buyed.styles';
import { GenericCard } from '../../atoms/genericCard/genericCard.atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Buyed>;
}

interface CartDetailProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

const PURCHASED_ITEMS_KEY = '@purchased_items';

const BuyedScreen = ({ navigation }: Props) => {
  const [purchasedItems, setPurchasedItems] = useState<CartDetailProduct[]>([]);

  const loadPurchasedItems = async () => {
    try {
      const itemsString = await AsyncStorage.getItem(PURCHASED_ITEMS_KEY);
      if (itemsString) {
        const items = JSON.parse(itemsString);
        setPurchasedItems(items);
      }
    } catch (error) {
      console.error('Error loading purchased items:', error);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  const savePurchasedItems = async (items: CartDetailProduct[]) => {
    try {
      await AsyncStorage.setItem(PURCHASED_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving purchased items:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const updatedItems = purchasedItems.filter((item) => item.id !== itemId);
    setPurchasedItems(updatedItems);
    await savePurchasedItems(updatedItems);
  };

  const handleUpdateQuantity = async (itemId: number, increment: boolean) => {
    const updatedItems = purchasedItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setPurchasedItems(updatedItems);
    await savePurchasedItems(updatedItems);
  };

  const totalAmount = purchasedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderPurchasedItem = useCallback<ListRenderItem<CartDetailProduct>>(
    ({ item }) => (
      <View style={buyedStyles.itemContainer}>
        <View style={buyedStyles.cardContainer}>
          <GenericCard
            title={item.title}
            subTitle={`Quantità: ${item.quantity} - Totale: €${(item.price * item.quantity).toFixed(2)}`}
            image={{ uri: item.thumbnail }}
            backgroundColor={'#2e67bd'}
          />
          <View style={buyedStyles.controlsContainer}>
            <TouchableOpacity
              style={buyedStyles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, false)}>
              <Ionicons name="remove-circle-outline" size={24} color="#645CBB" />
            </TouchableOpacity>

            <Text style={buyedStyles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={buyedStyles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, true)}>
              <Ionicons name="add-circle-outline" size={24} color="#645CBB" />
            </TouchableOpacity>

            <TouchableOpacity
              style={buyedStyles.removeButton}
              onPress={() => handleRemoveItem(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [purchasedItems]
  );

  return (
    <View style={buyedStyles.container}>
      <Text style={buyedStyles.headerText}>Acquisti effettuati</Text>
      <FlatList
        data={purchasedItems}
        renderItem={renderPurchasedItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View style={buyedStyles.separator} />}
      />
      <View style={buyedStyles.totalContainer}>
        <Text style={buyedStyles.totalText}>Totale speso: €{totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default BuyedScreen;
