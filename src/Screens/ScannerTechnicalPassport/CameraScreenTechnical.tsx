import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import Colors from '../../Includes/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Defs, Mask, Rect, Svg} from 'react-native-svg';
import {
  SendTechnicalPassportPayload,
  sendTechnicalPassportRequest,
} from './sendTechnicalPassportSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {User, useAuth} from '../../Context/AuthContext';
import LoaderKit from 'react-native-loader-kit';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {RegularText} from '../../Includes/RegularText';

type FlashType = 'auto' | 'off' | 'on' | undefined;
type PageType = 'first' | 'second';

const CameraTechnicalComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const cardRotateAnimation = useSharedValue('0deg');
  const cardScaleAnimation = useSharedValue(0);
  const [noCamera, setNoCamera] = useState(false);
  const {authUser, login} = useAuth();
  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const {width, height} = useWindowDimensions();
  const [flash, setFlash] = useState<FlashType>('off');
  const [page, setPage] = useState<PageType>('first');
  const {loading} = useSelector(
    (state: RootState) => state.sendTechnicalPassportSlice,
  );
  let imageData = useRef<string[]>([]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(console.log).catch(console.warn);
    }
  }, [hasPermission, requestPermission]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const onChangeFlash = useCallback(() => {
    setFlash(prevFlash => (prevFlash === 'on' ? 'off' : 'on'));
  }, []);

  const takePhoto = useCallback(async () => {
    setNoCamera(true);
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePhoto({
          flash: flash,
          enableAutoRedEyeReduction: true,
          enableShutterSound: true,
        });
        let imagePath =
          Platform.OS === 'ios' ? data?.path : 'file://' + data.path;

        if (imagePath !== '' && page === 'first') {
          imageData.current = [...imageData.current, imagePath];
          setPage('second');
          cardScaleAnimation.value = 1;
          setTimeout(() => {
            cardRotateAnimation.value = '-180deg';
          }, 1000);
          setTimeout(() => {
            cardScaleAnimation.value = 0;
            setNoCamera(false);
          }, 2000);
        } else if (imagePath && page === 'second') {
          imageData.current = [...imageData.current, imagePath];
          cardRotateAnimation.value = '0deg';
          setPage('first');
          setNoCamera(true);
        }

        function isSendDriverLicensePayload(
          payload: any,
        ): payload is SendTechnicalPassportPayload {
          return (
            typeof payload === 'object' &&
            payload !== null &&
            'status' in payload &&
            'data' in payload
          );
        }

        if (imageData.current.length === 2) {
          dispatch(
            sendTechnicalPassportRequest({
              image1: imageData.current[0],
              image2: imageData.current[1],
              authUser,
            }),
          )
            .then(result => {
              if (isSendDriverLicensePayload(result.payload)) {
                const payload: SendTechnicalPassportPayload = result.payload;
                if (payload.status) {
                  const userData: User = {
                    car_license_front_photo:
                      payload.data?.car_license_front_photo,
                    car_license_back_photo:
                      payload.data?.car_license_back_photo,
                  };
                  login(userData);
                  setNoCamera(false);

                  navigation.navigate('DataAuto');
                }
              } else {
                navigation.navigate('ScannerHomeTechnical');
              }
            })
            .catch(error => {
              console.log('📢 [CameraScreenTechnical.tsx:143]', error.response);
            });
          imageData.current = [];
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }, [
    flash,
    page,
    cardScaleAnimation,
    cardRotateAnimation,
    dispatch,
    authUser,
    login,
    navigation,
  ]);

  const format = useCameraFormat(device, [
    {autoFocusSystem: 'contrast-detection'},
    {iso: 'max'},
  ]);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          perspective: 1500,
        },
        {
          rotateY: withTiming(cardRotateAnimation.value),
        },
        {
          scale: withSpring(cardScaleAnimation.value, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Modal visible={loading} transparent={true}>
        <View style={styles.loading}>
          <LoaderKit
            style={styles.load}
            name={'BallSpinFadeLoader'}
            color={Colors.black}
          />
        </View>
      </Modal>
      <AntDesign
        name={'arrowleft'}
        color={Colors.white}
        style={[styles.goBack, {top: insets.top + 10}]}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <View
        style={[
          styles.cameraTextParent,
          {
            top: insets.top + 70,
          },
        ]}>
        <RegularText style={styles.cameraText}>
          {page === 'first' ? 'СТС Передняя часть' : 'СТС Задняя часть'}
        </RegularText>
      </View>
      {device && hasPermission && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          photo={true}
          resizeMode={'cover'}
          focusable={true}
          isActive={isFocused}
          format={format}
          pixelFormat={'yuv'}
        />
      )}
      <Svg width={'100%'} height={'100%'} style={styles.svg}>
        <Defs>
          <Mask id={'mask'} width={'100%'} height={'100%'} x={0} y={0}>
            <Rect width={'100%'} height={'100%'} fill={Colors.white} />
            <Rect
              x={50}
              y={width / 2.5}
              height={height / 1.7}
              width={width - 100}
              fill={Colors.black}
            />
          </Mask>
        </Defs>

        <Rect
          width={'100%'}
          height={'100%'}
          fill={'rgba(0,0,0,0.8)'}
          mask={'url(#mask)'}
        />

        <Rect
          x={50}
          y={width / 2.5}
          height={height / 1.7}
          width={width - 100}
          fill={'transparent'}
          strokeWidth={3}
          stroke={Colors.white}
        />
      </Svg>
      <Animated.View style={[styles.animatedCard, rotateStyle]}>
        <FontAwesome name={'drivers-license'} color={Colors.white} size={200} />
      </Animated.View>
      {device && (
        <TouchableOpacity
          disabled={noCamera}
          onPress={takePhoto}
          activeOpacity={0.6}
          style={[styles.cameraButton, {bottom: insets.bottom + 10}]}>
          <Entypo name={'camera'} color={Colors.darker} size={30} />
        </TouchableOpacity>
      )}
      {device && (
        <TouchableOpacity
          onPress={onChangeFlash}
          activeOpacity={0.6}
          style={[
            styles.flashStyle,
            {
              bottom: insets.bottom + 20,
              backgroundColor:
                flash === 'on' ? Colors.white : Colors.whiteOpacity,
            },
          ]}>
          <Entypo
            name={'flash'}
            color={flash === 'on' ? Colors.lightYellow : Colors.darker}
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.whiteOpacity,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBack: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  cameraTextParent: {
    position: 'absolute',
    zIndex: 1,
  },
  cameraText: {
    color: Colors.white,
  },

  cameraButton: {
    position: 'absolute',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darker,
  },
  flashStyle: {
    position: 'absolute',
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 50,
    left: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darker,
  },
  svg: {
    position: 'absolute',
  },
  load: {
    width: 100,
    height: 100,
  },
  animatedCard: {
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'visible',
  },
});

export const CameraScreenTechnical = memo(CameraTechnicalComponent);
