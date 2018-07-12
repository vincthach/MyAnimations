/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component, PureComponent } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Button,
  Dimensions,
  PanResponder
} from "react-native";
const { width: windowWidth } = Dimensions.get("window");

// Number information
const MAX_NUMBER = 50;
const MIN_NUMBER = 1;
//  MAX BALL IN ONE LINE
const MAX_BALL = 9;
const MAX_BALL_VISIBLE = 7;
//  THE ITEM HEIGHT
const ITEM_HEIGHT = parseInt(windowWidth / MAX_BALL_VISIBLE);

// Duration for 1 step
const MAX_ANIMATION_DURATION = 500;

const BALL_3TH_VISIBLE_POS = ITEM_HEIGHT * 2;

const BallPositions = {
  POS_1: -ITEM_HEIGHT,
  POS_2: 0,
  POS_3: ITEM_HEIGHT,
  POS_4: ITEM_HEIGHT * 2,
  POS_5: ITEM_HEIGHT * 3,
  POS_6: ITEM_HEIGHT * 4,
  POS_7: ITEM_HEIGHT * 5,
  POS_8: ITEM_HEIGHT * 6,
  POS_9: ITEM_HEIGHT * MAX_BALL_VISIBLE
};

const onBallLoop = callback => {
  for (let index = 0; index < MAX_BALL; index++) {
    callback(index);
  }
};

const getPreviousNumber = currentNumber => {
  if (currentNumber === MIN_NUMBER) {
    return MAX_NUMBER;
  }
  return currentNumber - 1;
};
const getNextNumber = currentNumber => {
  if (currentNumber === MAX_NUMBER) {
    return MIN_NUMBER;
  }
  return currentNumber + 1;
};

class BallItemLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: props.textValue
    };
  }

  getValue = () => this.state.textValue;

  setValue = newValue => {
    this.setState({ textValue: newValue });
  };

  render() {
    const { panHandlers, ballStyle, textStyle } = this.props;
    const { textValue } = this.state;
    return (
      <Animated.View {...panHandlers} style={ballStyle}>
        <Animated.Text style={textStyle}>{textValue}</Animated.Text>
      </Animated.View>
    );
  }
}

const createArray = (arrLength = MAX_BALL) => {
  const array = [];
  array.arrLength;
  return array;
};

const createFirstTextValues = () => [
  MAX_NUMBER - 4,
  MAX_NUMBER - 3,
  MAX_NUMBER - 2,
  MAX_NUMBER - 1,
  MIN_NUMBER,
  MIN_NUMBER + 1,
  MIN_NUMBER + 2,
  MIN_NUMBER + 3,
  MIN_NUMBER + 4
];

export default class App extends Component {
  constructor(props) {
    super(props);
    // List panresponder
    this.panResponders = createArray();
    // List Animated XY
    this.posAnimatedXYValues = createArray();
    // List position XY
    this.posXYList = createArray();
    // Current animation;
    this.arrayBallNumber = createFirstTextValues();
    // Bold text animations
    this.boldTextAnimationValues = createArray();
    this.boldTextAnimations = createArray();
    // Ref Text
    this.ballRefs = createArray();
  }

  setUpBallAnimationConfig = index => {
    // Setup config by index
    const { posAnimatedXYValues, posXYList, panResponders } = this;
    posAnimatedXYValues[index] = new Animated.ValueXY();
    posXYList[index] = { x: 0, y: 0 };
    // Add listener for ball
    posAnimatedXYValues[index].addListener(value => {
      posXYList[index] = value;
    });
    // Initialize PanResponder with move handling
    panResponders[index] = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: posAnimatedXYValues[index].x, dy: posAnimatedXYValues[index].y }
      ]),
      onPanResponderGrant: (e, gesture) => {
        posAnimatedXYValues[index].setOffset({
          x: posXYList[index].x,
          y: posXYList[index].y
        });
      }
    });
    // Set current position for current index
    posAnimatedXYValues[index].setValue({
      x: ITEM_HEIGHT * index - ITEM_HEIGHT,
      y: 0
    });
    // Setup Bold animation
    this.boldTextAnimationValues[index] = new Animated.Value(0);
    this.boldTextAnimations[index] = this.boldTextAnimationValues[
      index
    ].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.5, 2]
    });
  };

  componentWillMount() {
    onBallLoop(index => this.setUpBallAnimationConfig(index));
  }

  _createSlideToRightAnimation = index => {
    const currentPos = this.posXYList[index].x;
    const animations = [];
    let toXValue = currentPos + ITEM_HEIGHT;

    if (currentPos === BallPositions.POS_4) {
      animations.push(
        Animated.timing(this.boldTextAnimationValues[index], {
          duration: MAX_ANIMATION_DURATION,
          toValue: 1,
          useNativeDriver: true
        })
      );
    } else {
      animations.push(
        Animated.timing(this.boldTextAnimationValues[index], {
          duration: MAX_ANIMATION_DURATION,
          toValue: 0,
          useNativeDriver: true
        })
      );
    }

    if (currentPos === BallPositions.POS_9) {
      toXValue = BallPositions.POS_1;
      this.posAnimatedXYValues[index].setValue({
        x: BallPositions.POS_1 - ITEM_HEIGHT,
        y: 0
      });
    }
    animations.push(
      Animated.timing(this.posAnimatedXYValues[index], {
        toValue: { x: toXValue, y: 0 },
        duration: MAX_ANIMATION_DURATION,
        useNativeDriver: true
      })
    );

    return Animated.parallel(animations, { stopTogether: true });
  };

  _createSlideToLeftAnimation = index => {
    const currentPos = this.posXYList[index].x;
    const animations = [];
    let toXValue = currentPos - ITEM_HEIGHT;

    if (currentPos === BallPositions.POS_6) {
      animations.push(
        Animated.timing(this.boldTextAnimationValues[index], {
          duration: MAX_ANIMATION_DURATION,
          toValue: 1,
          useNativeDriver: true
        })
      );
    } else {
      animations.push(
        Animated.timing(this.boldTextAnimationValues[index], {
          duration: MAX_ANIMATION_DURATION,
          toValue: 0,
          useNativeDriver: true
        })
      );
    }

    if (currentPos === BallPositions.POS_1) {
      toXValue = BallPositions.POS_9;
      this.posAnimatedXYValues[index].setValue({
        x: BallPositions.POS_9,
        y: 0
      });
    }

    animations.push(
      Animated.timing(this.posAnimatedXYValues[index], {
        toValue: { x: toXValue, y: 0 },
        duration: MAX_ANIMATION_DURATION,
        useNativeDriver: true
      })
    );

    return Animated.parallel(animations, { stopTogether: true });
  };

  _slideToRight = () => {
    if (this.isStopAnimation) {
      return;
    }
    const arrayAnimation = [];
    onBallLoop(index => {
      arrayAnimation.push(this._createSlideToRightAnimation(index));
    });

    this.currentAnimation = Animated.parallel(arrayAnimation, {
      stopTogether: true,
      useNativeDriver: true
    });
    this.currentAnimation.start(callback => this._slideToRight());
  };

  _slideToLeft = () => {
    if (this.isStopAnimation) {
      return;
    }
    const arrayAnimation = [];
    onBallLoop(index => {
      arrayAnimation.push(this._createSlideToLeftAnimation(index));
    });

    this.currentAnimation = Animated.parallel(arrayAnimation, {
      stopTogether: true,
      useNativeDriver: true
    });
    this.currentAnimation.start(() => this._slideToLeft());
  };

  _renderBalls = () => {
    var ballArrayLayouts = [];
    onBallLoop(index => {
      ballArrayLayouts.push(
        <BallItemLayout
          key={index}
          ref={ref => (this.ballRefs[index] = ref)}
          panHandler={this.panResponders[index].panHandlers}
          ballStyle={[
            styles.square,
            {
              marginTop: index === 0 ? 0 : -ITEM_HEIGHT,
              transform: this.posAnimatedXYValues[index].getTranslateTransform()
            }
          ]}
          textStyle={{ transform: [{ scale: this.boldTextAnimations[index] }] }}
          textValue={this.arrayBallNumber[index]}
        />
      );
    });
    return ballArrayLayouts;
  };

  _toggleAnimation = () => {
    //this.currentAnimation && this.currentAnimation.stop();
    this.isStopAnimation = !this.isStopAnimation;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>{this._renderBalls()}</View>
        <Button title="Start Right" onPress={this._slideToRight} />
        <Button title="Start Left" onPress={this._slideToLeft} />
        <Button title="Start Stop" onPress={this._toggleAnimation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  row: {
    marginTop: 120,
    height: ITEM_HEIGHT,
    backgroundColor: "#ffca28"
  },
  square: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffca28"
  }
});
