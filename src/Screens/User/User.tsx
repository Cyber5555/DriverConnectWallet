import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useAuth} from '../../Context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Http} from '../../../http';
import Colors from '../../Includes/Colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RegularText} from '../../Includes/RegularText';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

type UserProps = {};

const UserComponent = ({}: UserProps) => {
  const {logout, authUser} = useAuth();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const {auth_user_info, auth_user_car_info} = useSelector(
    (state: RootState) => state.authUserInfoSlice,
  );
  const logoutFunc = async () => {
    const response: {data: {status: boolean}} = await Http.get(
      `${process.env.API_URL}logout`,
      {
        Authorization: `Bearer ${authUser?.token}`,
      },
    );
    if (response.data.status) {
      logout();
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        ...{paddingTop: insets.top},
      }}>
      <View style={styles.headerWrapper}>
        <AntDesign
          name={'edit'}
          color={Colors.black}
          size={28}
          onPress={() => navigation.navigate('ScannerHomeTechnical')}
        />
        <RegularText style={styles.name_surname}>
          {auth_user_info?.name} {auth_user_info?.surname}
        </RegularText>

        <AntDesign
          name={'logout'}
          color={Colors.black}
          size={28}
          onPress={logoutFunc}
        />
      </View>

      {auth_user_car_info?.mark?.name ? (
        <RegularText style={styles.carData}>
          {auth_user_car_info?.color} {auth_user_car_info?.mark?.name}{' '}
          {auth_user_car_info?.model?.name} {auth_user_car_info?.callsign}
        </RegularText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  name_surname: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 20,
  },
  carData: {
    color: Colors.dark,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
});

export const User = memo(UserComponent);
