import React, {memo, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useAuth} from '../../Context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Http} from '../../../http';
import Colors from '../../Includes/Colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RegularText} from '../../Includes/RegularText';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {LoginInput} from '../../Components/LoginInput';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import RenderHTML from 'react-native-render-html';
import {getFAQRequest} from '../Payments/getFAQSlice';

type ProfileProps = {};

const ProfileComponent = ({}: ProfileProps) => {
  const {logout, authUser} = useAuth();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const {width} = useWindowDimensions();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const {auth_user_info, auth_user_car_info} = useSelector(
    (state: RootState) => state.authUserInfoSlice,
  );
  const {get_faq} = useSelector((state: RootState) => state.getFAQSlice);
  const [phoneNumber, setPhoneNumber] = useState('');

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

  useEffect(() => {
    dispatch(getFAQRequest({token: authUser?.token}));
    setPhoneNumber(auth_user_car_info.phone);
  }, [authUser?.token, auth_user_car_info.phone, dispatch]);

  console.log('📢 [Profile.tsx:47]', get_faq);

  const toggleExpand = (id: number) => {
    setExpandedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id],
    );
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
          {auth_user_car_info?.model?.name}
        </RegularText>
      ) : null}

      {auth_user_car_info?.callsign ? (
        <RegularText style={styles.carNumber}>
          {auth_user_car_info?.callsign}
        </RegularText>
      ) : null}

      <LoginInput
        label={'Изменить номер телефона'}
        setUnmaskedPhone={text => setPhoneNumber(text)}
        setPhone={text => setPhoneNumber(text)}
        placeholder={'+x (xxx) xxx-xx-xx'}
        phone={phoneNumber}
        error={false}
        containerStyle={styles.input}
      />
      <View style={styles.faqAccordionContainer}>
        {get_faq.map(item => (
          <View key={item.id} style={styles.accordionItem}>
            <TouchableOpacity
              onPress={() => toggleExpand(item.id)}
              style={styles.accordionHeader}>
              <RegularText style={styles.accordionHeaderText}>
                {item.faq}
              </RegularText>
            </TouchableOpacity>
            {expandedItems.includes(item.id) && (
              <View style={styles.accordionContent}>
                <RenderHTML contentWidth={width} source={{html: item.replay}} />
              </View>
            )}
          </View>
        ))}
      </View>
      <AdaptiveButton onPress={() => {}} containerStyle={styles.deleteAccount}>
        Удалить аккаунт
      </AdaptiveButton>
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
    marginTop: 20,
    fontSize: 20,
  },
  carNumber: {
    color: Colors.dark,
    fontSize: 20,
  },
  input: {
    marginTop: 20,
  },
  deleteAccount: {
    width: '50%',
    height: 40,
    backgroundColor: Colors.red,
    borderRadius: 20,
    bottom: 40,
    position: 'absolute',
  },
  accordionItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#fff',
  },
  faqAccordionContainer: {
    marginTop: 20,
  },
});

export const Profile = memo(ProfileComponent);
