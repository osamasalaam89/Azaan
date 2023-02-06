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
import {Coordinates, CalculationMethod, PrayerTimes} from 'adhan';
import moment from 'moment';

type ListItemTypes = {
  id: string;
  prayerName: string;
  prayerTime: Date;
};

interface ItemProps {
  item: ListItemTypes;
  isSelected: boolean;
  onSelect: (item: ListItemTypes) => void;
}

const calculateQiblaDirection = (heading: number) => {
  console.log('heading', heading);
  const meccaDirection = 66.52;
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
      <Text style={{textAlign: 'center'}}>
        {moment(item?.prayerTime).format('LT')}
      </Text>
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
  const data: ListItemTypes[] = [
    {id: '1', prayerName: 'Fajr', prayerTime: new Date()},
    {id: '2', prayerName: 'Dhuhr', prayerTime: new Date()},
    {id: '3', prayerName: 'Asr', prayerTime: new Date()},
    {id: '4', prayerName: 'Maghrib', prayerTime: new Date()},
    {id: '5', prayerName: `Isha`, prayerTime: new Date()},
  ];

  const [selected, setSelected] = useState<ListItemTypes[]>([]);
  const [heading, setHeading] = useState(0);

  const coordinates = new Coordinates(24.8615, 67.0099);
  const params = CalculationMethod.Karachi();
  const date = new Date(2023, 2, 6);
  const prayerTimes: any = new PrayerTimes(coordinates, date, params);

  console.log('prayerTimes', prayerTimes);

  const updatedData = data.map(item => {
    const key = item.prayerName.toLowerCase();
    if (prayerTimes[key]) {
      return {...item, prayerTime: prayerTimes[key]};
    }
    return item;
  });
  React.useEffect(() => {
    const degreeUpdateRate = 3;
    CompassHeading.start(degreeUpdateRate, ({heading}) => {
      setHeading(heading);
    });
    return () => {
      CompassHeading.stop();
    };
  }, []);

  const pressMethod = (item: ListItemTypes) => {
    setSelected(prevSelected => {
      if (prevSelected.find(selectedItem => selectedItem.id === item.id)) {
        return prevSelected.filter(selectedItem => selectedItem.id !== item.id);
      }
      return [...prevSelected, item];
    });
  };

  const renderItem = ({item}: {item: ListItemTypes}) => (
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
      <FlatList renderItem={renderItem} data={updatedData} />
      <Animated.View
        style={{
          transform: [{rotate: `${qiblaDegrees}deg`}],
          marginBottom: 200,
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: 'blue',
          }}
        />
      </Animated.View>
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
