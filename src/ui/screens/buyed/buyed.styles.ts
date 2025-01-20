import { StyleSheet } from 'react-native';

export const buyedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0E68C',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#645CBB',
  },
  itemContainer: {
    marginVertical: 8,
  },
  cardContainer: {
    width: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#645CBB',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#645CBB',
    opacity: 0.2,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#645CBB',
    paddingTop: 16,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#645CBB',
  },
});
