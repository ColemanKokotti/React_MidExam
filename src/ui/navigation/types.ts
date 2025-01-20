export enum Screen {
  TabNavigator = 'TabNavigator',
  Home = 'Home',
  Detail = 'Detail',
  Buyed = 'Buyed',
  Favorites = 'Favorites',
}

export type TabParams = {
  [Screen.Home]: {
    hasFavoritesUpdated: boolean;
  };
  [Screen.Buyed]: undefined;
  [Screen.Favorites]: {
    hasFavoritesUpdated: boolean;
  };
};

export type MainParamList = {
  [Screen.TabNavigator]: undefined;
  [Screen.Detail]: {
    id: number;
    idsArray: number[];
  };
  [Screen.Buyed]: undefined;
  [Screen.Home]: {
    hasFavoritesUpdated: boolean;
  };
  [Screen.Favorites]: {
    hasFavoritesUpdated: boolean;
  };
};
