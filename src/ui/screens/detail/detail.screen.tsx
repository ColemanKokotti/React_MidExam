import { FlatList, ListRenderItem, View, Text } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { GenericCard } from '../../atoms/genericCard/genericCard.atom';
import { styles } from './detail.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../atoms/button/button.atom';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartDetailProduct {
  discountPercentage: number;
  discountedTotal: number;
  id: number;
  price: number;
  quantity: number;
  thumbnail: string;
  title: string;
  total: number;
}

interface CartDetail {
  discountedTotal: number;
  id: number;
  products: CartDetailProduct[];
  total: number;
  totalProducts: number;
  totalQuantity: number;
  userId: number;
}

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Detail>;
  route: RouteProp<MainParamList, Screen.Detail>;
}

const PURCHASED_ITEMS_KEY = '@purchased_items';

const DetailScreen = ({ navigation, route }: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { id, idsArray } = route.params;
  const [cart, setCart] = useState<CartDetail | null>(null);
  const [purchaseMessageVisible, setPurchaseMessageVisible] = useState(false);

  const currentIndex = useMemo(() => idsArray.indexOf(id), [id, idsArray]);

  const backIconColor = useMemo(() => (currentIndex > 0 ? '#645CBB' : '#cccccc'), [currentIndex]);
  const forwardIconColor = useMemo(
    () => (currentIndex < idsArray.length - 1 ? '#645CBB' : '#cccccc'),
    [currentIndex, idsArray.length]
  );

  const handleBack = useCallback(() => {
    const nextId = idsArray[currentIndex - 1];
    if (!nextId) {
      return;
    }
    navigation.setParams({ id: nextId });
  }, [currentIndex, idsArray, navigation]);

  const handleNext = useCallback(() => {
    const nextId = idsArray[currentIndex + 1];
    if (!nextId) {
      return;
    }
    navigation.setParams({ id: nextId });
  }, [currentIndex, idsArray, navigation]);

  useEffect(() => {
    fetch('https://dummyjson.com/carts/' + id)
      .then((res) => res.json())
      .then(setCart);
  }, [id]);

  const savePurchasedItems = async (newItems: CartDetailProduct[]) => {
    try {
      const existingItemsString = await AsyncStorage.getItem(PURCHASED_ITEMS_KEY);
      const existingItems: CartDetailProduct[] = existingItemsString
        ? JSON.parse(existingItemsString)
        : [];

      const updatedItems = [...existingItems, ...newItems];
      await AsyncStorage.setItem(PURCHASED_ITEMS_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving purchased items:', error);
    }
  };

  const handlePurchase = async () => {
    if (cart?.products) {
      await savePurchasedItems(cart.products);
      setPurchaseMessageVisible(true);
      setTimeout(() => {
        setPurchaseMessageVisible(false);
      }, 1000);
    }
  };

  const renderDetailItem = useCallback<ListRenderItem<CartDetailProduct>>(({ item }) => {
    return (
      <View style={styles.detailItem}>
        <GenericCard
          title={item.title}
          subTitle={String(item.price)}
          image={{ uri: item.thumbnail }}
          backgroundColor={'#2e67bd'}
        />
      </View>
    );
  }, []);

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  return (
    <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
      <View style={styles.navigatorContainer}>
        <Ionicons
          name={'chevron-back-circle'}
          size={24}
          onPress={handleBack}
          color={backIconColor}
        />
        <Ionicons
          name={'chevron-forward-circle'}
          size={24}
          onPress={handleNext}
          color={forwardIconColor}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={cart?.products}
        renderItem={renderDetailItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />

      {purchaseMessageVisible && (
        <View style={styles.overlay}>
          <View style={styles.purchaseMessageContainer}>
            <Text style={styles.purchaseMessage}>Acquisto effettuato!</Text>
          </View>
        </View>
      )}

      <Button title={'Acquista'} onPress={handlePurchase}>
        <Text>{'Acquista'}</Text>
      </Button>
      <View style={styles.spacer}></View>
      <Button title={'Torna indietro'} onPress={navigation.goBack}>
        <Text>{'Torna indietro'}</Text>
      </Button>
      <View style={styles.spacer}></View>
    </View>
  );
};

export default DetailScreen;
