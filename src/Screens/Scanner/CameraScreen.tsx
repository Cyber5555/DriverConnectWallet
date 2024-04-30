// import {useNavigation} from '@react-navigation/native';
// import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   useWindowDimensions,
//   Platform,
//   Image,
// } from 'react-native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
//   useFrameProcessor,
// } from 'react-native-vision-camera';
// import Colors from '../../Includes/Colors';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {RootNavigationProps} from '../../Router/RootNavigation';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {Defs, Mask, Rect, Svg} from 'react-native-svg';
// import {crop} from 'vision-camera-cropper';
// import {recognize} from 'vision-camera-dynamsoft-label-recognizer';

// type FlashType = 'auto' | 'off' | 'on' | undefined;

// //the value is in percentage
// export interface ScanRegion {
//   left: number;
//   top: number;
//   width: number;
//   height: number;
// }

// export interface ScanConfig {
//   scanRegion?: ScanRegion;
//   includeImageBase64?: boolean;
// }

// export interface CustomModelConfig {
//   customModelFolder: string;
//   customModelFileNames: string[];
// }

// const CameraComponent = () => {
//   const insets = useSafeAreaInsets();
//   const device = useCameraDevice('back');
//   const {hasPermission, requestPermission} = useCameraPermission();

//   const {width, height} = useWindowDimensions();
//   const cameraRef = useRef<Camera>(null);
//   const [flash, setFlash] = useState<FlashType>('off');

//   const [image, setImage] = useState<any>('');

//   useEffect(() => {
//     if (!hasPermission) {
//       requestPermission().then(console.log).catch(console.warn);
//     }
//   }, [hasPermission, requestPermission]);

//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

//   const onChangeFlash = useCallback(() => {
//     setFlash(prevFlash => (prevFlash === 'on' ? 'off' : 'on'));
//   }, []);

//   const takePhoto = useCallback(async () => {
//     if (cameraRef.current) {
//       try {
//         const data = await cameraRef.current.takePhoto({
//           flash: flash,
//         });
//         const imagePath =
//           Platform.OS === 'ios' ? data?.path : 'file://' + data.path;
//         console.log(imagePath);
//       } catch (error) {
//         console.error('Error taking photo:', error);
//       }
//     }
//   }, [flash]);

//   // const frameProcessor = useFrameProcessor(frame => {
//   //   'worklet';
//   //   // const bananas = detectBananas();

//   //   // frame.render();
//   //   // for (const banana of bananas) {
//   //   //   const paint = Skia.Paint();
//   //   //   paint.setColor(Skia.Color('red'));
//   //   //   frame.drawRect(banana.rect, paint);
//   //   // }

//   //   const cropRegion = {
//   //     left: 10,
//   //     top: height / 2.5,
//   //     width: width - 40,
//   //     height: width / 2,
//   //   };
//   //   const result = crop(frame, {
//   //     cropRegion: cropRegion,
//   //     includeImageBase64: true,
//   //     saveAsFile: false,
//   //   });
//   //   setImage(result.base64);
//   //   console.log(result.base64);
//   // }, []);

//   const frameProcessor = useFrameProcessor(frame => {
//     'worklet';
//     const scanRegion = {
//       left: 20,
//       top: height / 2.5,
//       width: width - 40,
//       height: width / 2,
//     };
//     const scanResult = recognize(frame, scanRegion);
//     console.log(scanResult);
//   }, []);
//   return (
//     <View style={styles.container}>
//       <AntDesign
//         name={'arrowleft'}
//         color={Colors.white}
//         style={[styles.goBack, {top: insets.top + 10}]}
//         size={24}
//         onPress={() => navigation.goBack()}
//       />
//       {device && hasPermission && (
//         <Camera
//           ref={cameraRef}
//           style={[styles.camera, StyleSheet.absoluteFill]}
//           device={device}
//           photo={true}
//           resizeMode={'contain'}
//           focusable={true}
//           isActive={true}
//           frameProcessor={frameProcessor}
//           pixelFormat={'yuv'}
//         />
//       )}
//       <Svg width={'100%'} height={'100%'} style={styles.svg}>
//         <Defs>
//           <Mask id={'mask'} width={'100%'} height={'100%'} x={0} y={0}>
//             <Rect width={'100%'} height={'100%'} fill={Colors.white} />
//             <Rect
//               x={20}
//               y={height / 2.5}
//               height={width / 2}
//               width={width - 40}
//               fill={Colors.black}
//             />
//           </Mask>
//         </Defs>

//         <Rect
//           width={'100%'}
//           height={'100%'}
//           fill={'rgba(0,0,0,0.8)'}
//           mask={'url(#mask)'}
//         />

//         <Rect
//           x={20}
//           y={height / 2.5}
//           height={width / 2}
//           width={width - 40}
//           fill={'transparent'}
//           strokeWidth={5}
//           stroke={Colors.white}
//         />
//       </Svg>
//       {device && (
//         <TouchableOpacity
//           onPress={takePhoto}
//           activeOpacity={0.6}
//           style={[styles.cameraButton, {bottom: insets.bottom + 10}]}>
//           <Entypo name={'camera'} color={Colors.darker} size={30} />
//         </TouchableOpacity>
//       )}
//       {device && (
//         <TouchableOpacity
//           onPress={onChangeFlash}
//           activeOpacity={0.6}
//           style={[
//             styles.flashStyle,
//             {
//               bottom: insets.bottom + 20,
//               backgroundColor:
//                 flash === 'on' ? Colors.white : Colors.whiteOpacity,
//             },
//           ]}>
//           <Entypo
//             name={'flash'}
//             color={flash === 'on' ? Colors.lightYellow : Colors.darker}
//             size={30}
//           />
//         </TouchableOpacity>
//       )}
//       {image && <Image source={{uri: image}} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//   },
//   goBack: {
//     position: 'absolute',
//     left: 20,
//     zIndex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   cameraButton: {
//     position: 'absolute',
//     backgroundColor: Colors.white,
//     alignSelf: 'center',
//     width: 60,
//     height: 60,
//     borderRadius: 50,
//     zIndex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.darker,
//   },
//   flashStyle: {
//     position: 'absolute',
//     backgroundColor: Colors.white,
//     width: 40,
//     height: 40,
//     borderRadius: 50,
//     left: 50,
//     zIndex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.darker,
//   },
//   svg: {
//     position: 'absolute',
//   },
// });

// export const CameraScreen = memo(CameraComponent);

import * as React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import {
  recognize,
  ScanConfig,
  ScanRegion,
  DLRCharacherResult,
  DLRLineResult,
  DLRResult,
} from 'vision-camera-dynamsoft-label-recognizer';
import * as DLR from 'vision-camera-dynamsoft-label-recognizer';
import {
  Camera,
  runAsync,
  runAtTargetFps,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Svg, Image, Rect, Circle} from 'react-native-svg';
import Clipboard from '@react-native-community/clipboard';
import {Worklets, useSharedValue} from 'react-native-worklets-core';

const RecognizedCharacter = (props: {char: DLRCharacherResult}) => {
  if (props.char.characterHConfidence > 50) {
    return <Text style={[styles.modalText]}>{props.char.characterH}</Text>;
  } else {
    return (
      <Text style={[styles.modalText, styles.lowConfidenceText]}>
        {props.char.characterH}
      </Text>
    );
  }
};

const scanRegion: ScanRegion = {
  left: 5,
  top: 40,
  width: 90,
  height: 10,
};

export function CameraScreen({route}) {
  const useCase = 0;
  const [imageData, setImageData] = React.useState(
    undefined as undefined | string,
  );
  const [isActive, setIsActive] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const modalVisibleShared = useSharedValue(false);
  const mounted = useSharedValue(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [frameWidth, setFrameWidth] = React.useState(1280);
  const [frameHeight, setFrameHeight] = React.useState(720);
  const [recognitionResults, setRecognitionResults] = React.useState(
    [] as DLRLineResult[],
  );
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1920, height: 1080}},
    {fps: 30},
  ]);
  React.useEffect(() => {
    (async () => {
      console.log('mounted');
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      let license =
        'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=='; //one-day public trial
      const result = await DLR.initLicense(license);
      if (result === false) {
        Alert.alert('Error', 'License invalid');
      }
      if (useCase === 0) {
        //mrz use case
        try {
          console.log('mrz use case');
          await DLR.useCustomModel({
            customModelFolder: 'MRZ',
            customModelFileNames: ['MRZ'],
          });
          await DLR.updateTemplate(
            '{"CharacterModelArray":[{"DirectoryPath":"","Name":"MRZ"}],"LabelRecognizerParameterArray":[{"Name":"default","ReferenceRegionNameArray":["defaultReferenceRegion"],"CharacterModelName":"MRZ","LetterHeightRange":[5,1000,1],"LineStringLengthRange":[30,44],"LineStringRegExPattern":"([ACI][A-Z<][A-Z<]{3}[A-Z0-9<]{9}[0-9][A-Z0-9<]{15}){(30)}|([0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z<]{3}[A-Z0-9<]{11}[0-9]){(30)}|([A-Z<]{0,26}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,26}<{0,26}){(30)}|([ACIV][A-Z<][A-Z<]{3}([A-Z<]{0,27}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,27}){(31)}){(36)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{8}){(36)}|([PV][A-Z<][A-Z<]{3}([A-Z<]{0,35}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,35}<{0,35}){(39)}){(44)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{14}[A-Z0-9<]{2}){(44)}","MaxLineCharacterSpacing":130,"TextureDetectionModes":[{"Mode":"TDM_GENERAL_WIDTH_CONCENTRATION","Sensitivity":8}],"Timeout":9999}],"LineSpecificationArray":[{"BinarizationModes":[{"BlockSizeX":30,"BlockSizeY":30,"Mode":"BM_LOCAL_BLOCK","MorphOperation":"Close"}],"LineNumber":"","Name":"defaultTextArea->L0"}],"ReferenceRegionArray":[{"Localization":{"FirstPoint":[0,0],"SecondPoint":[100,0],"ThirdPoint":[100,100],"FourthPoint":[0,100],"MeasuredByPercentage":1,"SourceType":"LST_MANUAL_SPECIFICATION"},"Name":"defaultReferenceRegion","TextAreaNameArray":["defaultTextArea"]}],"TextAreaArray":[{"Name":"defaultTextArea","LineSpecificationNameArray":["defaultTextArea->L0"]}]}',
          );
        } catch (error: any) {
          console.log(error);
          Alert.alert('Error', 'Failed to load model.');
        }
      } else {
        console.log('general use case');
        try {
          await DLR.resetRuntimeSettings();
        } catch (error) {
          console.log(error);
        }
      }
      mounted.value = true;
    })();
    return () => {
      console.log('unmounted');
      mounted.value = false;
      modalVisibleShared.value = false;
      setIsActive(false);
    };
  }, []);

  const getText = () => {
    let text = '';
    recognitionResults.forEach(result => {
      text = text + result.text + '\n';
    });
    return text.trim();
  };

  const renderImage = () => {
    if (imageData) {
      return (
        <Svg style={styles.srcImage} viewBox={getViewBoxForCroppedImage()}>
          <Image href={{uri: imageData}} />
          {charactersSVG('char', 0, 0)}
        </Svg>
      );
    }
    return null;
  };

  const charactersSVG = (prefix: string, offsetX: number, offsetY: number) => {
    let characters: React.ReactElement[] = [];
    let idx = 0;
    recognitionResults.forEach(lineResult => {
      lineResult.characterResults.forEach(characterResult => {
        characters.push(
          <Circle
            key={prefix + idx}
            cx={characterResult.location.points[0]!.x + offsetX}
            cy={characterResult.location.points[3]!.y + offsetY + 4}
            r="1"
            stroke="blue"
            fill="blue"
          />,
        );
        idx = idx + 1;
      });
    });

    if (characters.length > 0) {
      return characters;
    } else {
      return null;
    }
  };

  const getViewBox = () => {
    const frameSize = getFrameSize();
    const viewBox = '0 0 ' + frameSize.width + ' ' + frameSize.height;
    return viewBox;
  };

  const getViewBoxForCroppedImage = () => {
    const frameSize = getFrameSize();
    const viewBox =
      '0 0 ' +
      (frameSize.width * scanRegion.width) / 100 +
      ' ' +
      (frameSize.height * scanRegion.height) / 100;
    return viewBox;
  };

  const updateFrameSize = (width: number, height: number) => {
    if (width != frameWidth && height != frameHeight) {
      setFrameWidth(width);
      setFrameHeight(height);
    }
  };

  const getOffsetX = () => {
    const frameSize = getFrameSize();
    return (scanRegion.left / 100) * frameSize.width;
  };

  const getOffsetY = () => {
    const frameSize = getFrameSize();
    return (scanRegion.top / 100) * frameSize.height;
  };

  const getFrameSize = (): {width: number; height: number} => {
    let width: number, height: number;
    if (HasRotation()) {
      width = frameHeight;
      height = frameWidth;
    } else {
      width = frameWidth;
      height = frameHeight;
    }
    return {width: width, height: height};
  };

  const HasRotation = () => {
    let value = false;
    if (Platform.OS === 'android') {
      if (
        !(
          frameWidth > frameHeight &&
          Dimensions.get('window').width > Dimensions.get('window').height
        )
      ) {
        value = true;
      }
    }
    return value;
  };

  const updateFrameSizeJS = Worklets.createRunOnJS(updateFrameSize);
  const setImageDataJS = Worklets.createRunOnJS(setImageData);
  const setRecognitionResultsJS = Worklets.createRunOnJS(setRecognitionResults);
  const setModalVisibleJS = Worklets.createRunOnJS(setModalVisible);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    if (modalVisibleShared.value === false && mounted.value) {
      runAtTargetFps(1, () => {
        'worklet';
        updateFrameSizeJS(frame.width, frame.height);

        let config: ScanConfig = {};

        console.log('frame width:' + frame.width);
        console.log('frame height:' + frame.height);
        config.scanRegion = scanRegion;
        config.includeImageBase64 = true;
        let scanResult = recognize(frame, config);

        let results: DLRResult[] = scanResult.results;
        let lineResults: DLRLineResult[] = [];
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          const lines = result?.lineResults;
          if (lines) {
            lines.forEach(line => {
              lineResults.push(line);
            });
          }
        }

        console.log(results);
        if (modalVisibleShared.value === false) {
          //check is modal visible again since the recognizing process takes time
          if (
            lineResults.length >= 2 ||
            (useCase != 0 && lineResults.length > 0)
          ) {
            if (scanResult.imageBase64) {
              console.log('has image: ');
              setImageDataJS(
                'data:image/jpeg;base64,' + scanResult.imageBase64,
              );
            }
            setRecognitionResultsJS(lineResults);
            modalVisibleShared.value = true;
            setModalVisibleJS(true);
          }
        }
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {device != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            frameProcessor={frameProcessor}
            format={format}
            pixelFormat="yuv"
          />
          <Svg
            preserveAspectRatio="xMidYMid slice"
            style={StyleSheet.absoluteFill}
            viewBox={getViewBox()}>
            <Rect
              x={(scanRegion.left / 100) * getFrameSize().width}
              y={(scanRegion.top / 100) * getFrameSize().height}
              width={(scanRegion.width / 100) * getFrameSize().width}
              height={(scanRegion.height / 100) * getFrameSize().height}
              strokeWidth="2"
              stroke="red"
              fillOpacity={0.0}
            />
            {charactersSVG('char-cropped', getOffsetX(), getOffsetY())}
          </Svg>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          modalVisibleShared.value = !modalVisible;
          setModalVisible(!modalVisible);
          setRecognitionResults([]);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {renderImage()}
            {recognitionResults.map(result => (
              <Text key={'line-' + result.location.points[0].x}>
                {result.characterResults.map(char => (
                  <RecognizedCharacter
                    key={'rchar-' + char.location.points[0].x}
                    char={char}
                  />
                ))}
              </Text>
            ))}
            <View style={styles.buttonView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  Alert.alert('', 'Copied');
                  Clipboard.setString(getText());
                }}>
                <Text style={styles.textStyle}>Copy</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  modalVisibleShared.value = !modalVisible;
                  setModalVisible(!modalVisible);
                  setRecognitionResults([]);
                }}>
                <Text style={styles.textStyle}>Rescan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const monospaceFontFamily = () => {
  if (Platform.OS === 'ios') {
    return 'Courier New';
  } else {
    return 'monospace';
  }
};

const getWindowWidth = () => {
  return Dimensions.get('window').width;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonView: {
    flexDirection: 'row',

    position: 'absolute',
    bottom: 20,
    zIndex: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 5,
    backgroundColor: 'red',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 12,
    fontFamily: monospaceFontFamily(),
  },
  lowConfidenceText: {
    color: 'red',
  },
  srcImage: {
    width: getWindowWidth() * 0.7,
    height: 60,
    resizeMode: 'contain',
  },
});
