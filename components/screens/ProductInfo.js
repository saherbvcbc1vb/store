import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ToastAndroid,
  Animated,
  
} from 'react-native'
import { COLOURS, Items } from '../database/Database'
import Entypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'



const ProductInfo = ({ route, navigation }) => {
  const { productID } = route.params
  const [product, setProduct] = useState({})
  const width = Dimensions.get('window').width
  const scrollX = new Animated.Value(0)
  let position = Animated.divide(scrollX, width)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromDB()
    })
    return unsubscribe
  }, [navigation])
  //get product data by aysnc
  const getDataFromDB = async () => {
    for (let index = 0; index < Items.length; index++) {
      if (Items[index].id == productID) {
        await setProduct(Items[index])
        return
      }
    }
  }
  // add to cart

const addToCart = async (id) => {
  let itemArray = await AsyncStorage.getItem('cartItems')
  itemArray = JSON.parse(itemArray)
  if (itemArray) {
    let array = itemArray
    array.push(id)

    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(array))
      ToastAndroid.show('Item Added Successfully to cart', ToastAndroid.SHORT)
      navigation.navigate('Home')
    } catch (error) {
      return error
    }
  } else {
    let array = []
    array.push(id)
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(array))
      ToastAndroid.show('Item Added Successfully to cart', ToastAndroid.SHORT)
      navigation.navigate('Home')
    } catch (error) {
      return error
    }
  }
}

  /// product scroll
  const renderProduct = ({ item, index }) => {
    return (
      <View
        style={{
          width: width,
          height: 240,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={item}
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
      </View>
    )
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.white,
        position: 'relative',
      }}
    >
      <StatusBar
        backgroundColor={COLOURS.backgroundLight}
        barStyle={'dark-content'}
      />
      <ScrollView>
        <View
          style={{
            width: '100%',
            backgroundColor: COLOURS.backgroundLight,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 16,
              paddingLeft: 16,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo
                name="chevron-left"
                style={{
                  color: COLOURS.backgroundDark,
                  fontSize: 18,
                  padding: 12,
                  backgroundColor: COLOURS.white,
                  borderRadius: 10,
                  marginTop: 25,
                }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={product.productImageList ? product.productImageList : null}
            horizontal
            renderItem={renderProduct}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.8}
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
          />
        </View>
        <View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              marginTop: 10,
            }}
          >
            {product.productImageList
              ? product.productImageList.map((data, index) => {
                  let opacity = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.2, 1, 0.2],
                  })
                  return (
                    <Animated.View
                      key={index}
                      style={{
                        width: '16%',
                        height: 2.4,
                        backgroundColor: COLOURS.black,
                        opacity,
                        marginHorizontal: 4,
                        alignItems: 'center',
                        marginBottom: 4,
                      }}
                    ></Animated.View>
                  )
                })
              : null}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 6,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 14,
            }}
          >
            <Entypo
              name="shopping-cart"
              style={{
                fontSize: 18,
                color: COLOURS.blue,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: COLOURS.black,
              }}
            >
              shopping
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 4,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                letterSpacing: 0.5,
                marginVertical: 4,
                color: COLOURS.black,
                maxWidth: '84%',
              }}
            >
              {product.productName}
            </Text>
            <Ionicons
              name="link-outline"
              style={{
                fontSize: 24,
                color: COLOURS.blue,
                backgroundColor: COLOURS.blue + 10,
                padding: 8,
                borderRadius: 29,
                shadowColor: '#848484',
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 9,
                shadowOpacity: 0.8,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              color: COLOURS.black,
              fontWeight: '400',
              letterSpacing: 1,
              opacity: 0.5,
              lineHeight: 20,
              maxWidth: '85%',
              maxHeight: 44,
              marginBottom: 18,
            }}
          >
            {product.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 14,
              borderBottomColor: COLOURS.backgroundLight,
              borderBottomWidth: 1,
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  color: COLOURS.blue,
                  backgroundColor: COLOURS.backgroundLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 100,
                  marginRight: 10,
                }}
              >
                <Entypo
                  name="location-pin"
                  style={{
                    fontSize: 16,
                    color: COLOURS.blue,
                  }}
                />
              </View>
              <Text> Rustaveli Ave 57,{'\n'}17-001, Batume</Text>
            </View>
            <Entypo
              name="chevron-right"
              style={{
                fontSize: 22,
                color: COLOURS.backgroundDark,
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                maxWidth: '85%',
                color: COLOURS.black,
                marginBottom: 4,
              }}
            >
              &#8377; {product.productPrice}.00
            </Text>
            <Text>
              {' '}
              Tax Rate 2%~ &#8377;{product.productPrice / 20} (&#8377;
              {product.productPrice + product.productPrice / 20}){' '}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          height: '8%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => (product.isAvailable ? addToCart(product.id) : null)}
          style={{
            width: '70%',
            height: '70%',
            position: 'absolute',
            backgroundColor: COLOURS.blue,
            borderRadius: 70,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Entypo
            name="shopping-cart"
            style={{
              borderRadius: 1,
              marginRight: 10,
              color: COLOURS.white,
            }}
          />
          <Text
            name
            style={{
              textAlign: 'center',
              color: COLOURS.white,
              fontSize: 1.04 * 16, // Assuming the base font size is 16
              fontWeight: '600',
            }}
          >
            {product.isAvailable ? 'Add to cart' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default ProductInfo
