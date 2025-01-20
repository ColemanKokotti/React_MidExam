import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, View, Text } from 'react-native';
import { styles } from './favorites.styles';
import Card from '../../atoms/cart/cart.atom';
import { useCarts } from '../hook/useCarts.facade';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Favorites>;
}

const FavoritesScreen = ({ navigation }: Props) => {
  const { carts, favoriteIds, refreshCarts, loadFavorites, addFavorite } = useCarts();

  const favorites = useMemo(
    () => carts.filter((cart) => favoriteIds.includes(cart.id)),
    [carts, favoriteIds]
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <Card
        cart={item}
        onAddFavorite={() => addFavorite(item)}
        selected={favoriteIds.includes(item.id)}
        onPress={() => {}}
      />
    ),
    [addFavorite, favoriteIds]
  );

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshCarts();
      loadFavorites();
    });

    return unsubscribe;
  }, [loadFavorites, navigation, refreshCarts]);

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      ) : (
        <Text>No favorites yet</Text>
      )}
    </View>
  );
};

export default FavoritesScreen;
