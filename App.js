/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Animated, Button, Dimensions, PanResponder } from 'react-native';
const { width: windowWidth } = Dimensions.get("window");
//  MAX BALL IN ONE LINE
const MAX_BALL = 7;
//  THE ITEM HEIGHT
const ITEM_HEIGHT = windowWidth / MAX_BALL;

const MAX_ANIMATION_DURATION = 500;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.panResponders = [];
    this.panResponders.length = MAX_BALL;
    this.posAnimatedXYValues = [];
    this.posAnimatedXYValues.length = MAX_BALL;
    this.posXYList = [];
    this.posXYList.length = MAX_BALL;
  }

  initAnimationConfig = (index) => {
    // Get current state
    const { posAnimatedXYValues, posXYList, panResponders } = this;
    posAnimatedXYValues[index] = new Animated.ValueXY();
    posXYList[index] = { x: 0, y: 0 };
    // Add listener for ball
    posAnimatedXYValues[index].addListener((value) => {
      posXYList[index] = value;
    });
    // Initialize PanResponder with move handling
    panResponders[index] = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null, { dx: posAnimatedXYValues[index].x, dy: posAnimatedXYValues[index].y }
      ]),
      onPanResponderGrant: (e, gesture) => {
        posAnimatedXYValues[index].setOffset({
          x: posXYList[index].x,
          y: posXYList[index].y
        })
        //posAnimatedXYValues[index].setValue({ x: 0, y: 0 })
      }
    });
    posAnimatedXYValues[index].setValue({ x: ITEM_HEIGHT * index, y: 0 })
  }

  componentWillMount() {
    this.initAnimationConfig(0);
    this.initAnimationConfig(1);
  }

  createAnimation = (index) => {
    const currentPos = this.posXYList[index].x;
    let toXValue = currentPos + ITEM_HEIGHT;
    if (currentPos >= ITEM_HEIGHT * 6) {
      toXValue = 0;
      this.posAnimatedXYValues[index].setValue({ x: -ITEM_HEIGHT, y: 0 })
    }
    let duration = 1000;
    if (toXValue === 0) {
      duration = duration / 2;
    }
    return Animated.timing(this.posAnimatedXYValues[index], {
      toValue: { x: toXValue, y: 0 },
      duration: duration
    })
  }

  _startAllAnimations = () => {
    const arrayAnims = [
      this.createAnimation(0),
      this.createAnimation(1)
    ];
    Animated.parallel(arrayAnims).start(() => this._startAllAnimations())
  }


  render() {
    const panStyle = {
      transform: this.posAnimatedXYValues[0].getTranslateTransform()
    }
    const panStyle1 = {
      transform: this.posAnimatedXYValues[1].getTranslateTransform()
    }
    return (
      <View style={styles.container}>
        <Animated.View style={styles.row}>
          <Animated.View {...this.panResponders[0].panHandlers} style={[styles.square, panStyle]} />
          <Animated.View {...this.panResponders[1].panHandlers} style={[styles.square, { marginTop: -ITEM_HEIGHT }, panStyle1]} />
        </Animated.View>
        <Button title="Start Animation" onPress={this._startAllAnimations} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  row: {
    marginTop: 150,
    height: ITEM_HEIGHT,
    backgroundColor: "#1e1e1e",
    borderColor: 1,

  },
  square: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    backgroundColor: "#ffca28"
  }
});
