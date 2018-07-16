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
import {
  MAX_ANIMATION_DURATION,
  MAX_NUMBER,
  MIN_NUMBER,
  MAX_BALL,
  MAX_BALL_VISIBLE,
  ITEM_HEIGHT,
  createArray,
  createFirstTextValues,
  BallPositions,
  forEachBallIndex,
  getPreviousNumber,
  getNextNumber,
  BallScrollState
} from "./Config";
import GestureRecognizer from "./GestureRecognizer";
import BallItemLayout from "./BallItemLayout";

export default class HorizontalSpin extends Component {
  constructor(props) {
    super(props);
    this.animationDuration = MAX_ANIMATION_DURATION;
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
    // Hold index left, and right position when scroll
    this.ballLeftIndex = 0;
    this.ballRightIndex = 0;

    this.animationState = BallScrollState.IDLE;

    this.enableScaleAnimation = true;
  }

  setUpBallAnimation = index => {
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

  setUpBallsAnimation() {
    forEachBallIndex(index => this.setUpBallAnimation(index));
  }

  componentWillMount() {
    this.setUpBallsAnimation();
  }

  _createSlideToRightAnimation = index => {
    const currentPos = this.posXYList[index].x;
    const animations = [];
    let toXValue = currentPos + ITEM_HEIGHT;

    if (currentPos === BallPositions.POS_1) {
      this.ballLeftIndex = index;
    }

    if (this.enableScaleAnimation) {
      if (currentPos === BallPositions.POS_4) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration / 2,
            toValue: 1,
            useNativeDriver: true
          })
        );
      } else {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration / 2,
            toValue: 0,
            useNativeDriver: true
          })
        );
      }
    }

    if (currentPos === BallPositions.POS_9) {
      toXValue = BallPositions.POS_1;
      this.posAnimatedXYValues[index].setValue({
        x: BallPositions.POS_1 - ITEM_HEIGHT,
        y: 0
      });
      this.ballRightIndex = index;
    }
    animations.push(
      Animated.timing(this.posAnimatedXYValues[index], {
        toValue: { x: toXValue, y: 0 },
        duration: this.animationDuration,
        useNativeDriver: true
      })
    );

    return Animated.parallel(animations, { stopTogether: true });
  };

  _createSlideToLeftAnimation = index => {
    const currentPos = this.posXYList[index].x;
    const animations = [];
    let toXValue = currentPos - ITEM_HEIGHT;
    if (currentPos === BallPositions.POS_9) {
      this.ballRightIndex = index;
    }
    if (this.enableScaleAnimation) {
      if (currentPos === BallPositions.POS_6) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration / 2,
            toValue: 1,
            useNativeDriver: true
          })
        );
      } else {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration / 2,
            toValue: 0,
            useNativeDriver: true
          })
        );
      }
    }
    if (currentPos === BallPositions.POS_1) {
      toXValue = BallPositions.POS_9;
      this.posAnimatedXYValues[index].setValue({
        x: BallPositions.POS_9,
        y: 0
      });
      this.ballLeftIndex = index;
    }

    animations.push(
      Animated.timing(this.posAnimatedXYValues[index], {
        toValue: { x: toXValue, y: 0 },
        duration: this.animationDuration,
        useNativeDriver: true
      })
    );

    return Animated.parallel(animations, { stopTogether: true });
  };

  _updateBallRight() {
    const ballLeft = this.ballRefs[this.ballLeftIndex];
    const ballRight = this.ballRefs[this.ballRightIndex];
    const prevValue = getPreviousNumber(ballLeft.getValue());
    ballRight.setValue(prevValue);
  }

  _updateBallLeft() {
    const ballLeft = this.ballRefs[this.ballLeftIndex];
    const ballRight = this.ballRefs[this.ballRightIndex];
    const nextValue = getNextNumber(ballRight.getValue());
    ballLeft.setValue(nextValue);
  }

  _slideToRight() {
    if (this.isStopped()) {
      this.idle();
      return;
    }
    const arrayAnimation = [];
    forEachBallIndex(index => {
      arrayAnimation.push(this._createSlideToRightAnimation(index));
    });

    Animated.parallel(arrayAnimation, {
      stopTogether: true,
      useNativeDriver: true
    }).start(callback => {
      this._updateBallRight();
      this._slideToRight();
    });
  }

  _slideToLeft() {
    if (this.isStopped()) {
      this.idle();
      return;
    }
    const arrayAnimation = [];
    forEachBallIndex(index => {
      arrayAnimation.push(this._createSlideToLeftAnimation(index));
    });

    Animated.parallel(arrayAnimation, {
      stopTogether: true,
      useNativeDriver: true
    }).start(() => {
      this._updateBallLeft();
      this._slideToLeft();
    });
  }

  _renderBalls = () => {
    var ballArrayLayouts = [];
    forEachBallIndex(index => {
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

  running() {
    this.animationState = BallScrollState.RUNNING;
  }

  stop() {
    this.animationState = BallScrollState.STOP;
  }

  idle() {
    this.animationState = BallScrollState.IDLE;
  }

  isRunning = () => this.animationState === BallScrollState.RUNNING;

  isStopped = () => this.animationState === BallScrollState.STOP;

  startSlideToRight() {
    if (this.isRunning()) {
      return;
    }
    this.running();
    this._slideToRight();
  }

  startSlideToLeft() {
    if (this.isRunning()) {
      return;
    }
    this.running();
    this._slideToLeft();
  }

  onSwipe = (state, gestureState) => {
    const { vx } = gestureState;
    let newVX = Math.round(Math.abs(vx));
    this.startSlideToRight();
    setTimeout(
      () => this.stop(),
      parseInt(this.animationDuration * MAX_BALL_VISIBLE * newVX)
    );
  };

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <GestureRecognizer
        config={config}
        onSwipe={this.onSwipe}
        style={styles.container}
      >
        {this._renderBalls()}
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
