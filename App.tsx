import React, {FC, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CompassHeading from 'react-native-compass-heading';

type listItemTypes = {
  id: string;
  prayerName: string;
  time: string;
  isSelected: boolean;
};

interface ItemProps {
  item: listItemTypes;
  isSelected: boolean;
  onSelect: (item: listItemTypes) => void;
}
const calculateQiblaDirection = (heading: any) => {
  const meccaDirection = 113.5;
  return (meccaDirection - heading + 360) % 360;
};
const MyItem: FC<ItemProps> = React.memo(({item, isSelected, onSelect}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
    <Text style={{flex: 0.3, alignSelf: 'center'}}>{item.prayerName}</Text>
    <View
      style={{
        flex: 0.4,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      <Text style={{textAlign: 'center'}}>{item.time}</Text>
      <TouchableOpacity onPress={() => onSelect(item)}>
        <Icon
          name={isSelected ? 'toggle-on' : 'toggle-off'}
          size={30}
          color="#900"
        />
      </TouchableOpacity>
    </View>
  </View>
));

const App: FC = () => {
  const data: listItemTypes[] = [
    {id: '1', prayerName: 'Fajr', time: '06:00 AM', isSelected: false},
    {id: '2', prayerName: 'Dhuhr', time: '01:00 PM', isSelected: false},
    {id: '3', prayerName: 'Asr', time: '05:00 PM', isSelected: false},
    {id: '4', prayerName: 'Maghrib', time: '06:30 PM', isSelected: false},
    {id: '5', prayerName: `Isha'a`, time: '07:00 PM', isSelected: false},
  ];

  const [selected, setSelected] = useState<listItemTypes[]>([]);
  const [heading, setHeading] = useState(0);
  React.useEffect(() => {
    const degree_update_rate = 3;
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      console.log('deg', heading, accuracy);
      setHeading(heading);
    });
    return () => {
      CompassHeading.stop();
    };
  }, []);

  const pressMethod = (item: listItemTypes) => {
    setSelected(prevSelected => {
      if (prevSelected.find(selectedItem => selectedItem.id === item.id)) {
        return prevSelected.filter(selectedItem => selectedItem.id !== item.id);
      }
      return [...prevSelected, item];
    });
  };

  const renderItem = ({item}: {item: listItemTypes}) => (
    <MyItem
      isSelected={
        selected.find(selectedItem => selectedItem.id === item.id) !== undefined
      }
      item={item}
      onSelect={pressMethod}
    />
  );

  const qiblaDegrees = calculateQiblaDirection(heading);

  return (
    <View style={{flex: 1, margin: 10}}>
      <FlatList renderItem={renderItem} data={data} />
      <View
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          top: 500,
          left: 200,
          borderRadius: 50,
          backgroundColor: 'black',
        }}
      />
      <Animated.View
        style={{
          transform: [{rotate: `${heading}deg`}],
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'blue',
          }}
        />
      </Animated.View>

      <Text>Qibla direction: {qiblaDegrees} degrees</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
  },
  arrowContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
