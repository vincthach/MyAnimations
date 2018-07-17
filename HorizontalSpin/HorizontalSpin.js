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
import GestureRecognizer, { swipeDirections } from "./GestureRecognizer";
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
    this.ballRightIndex = 8;
    this.ballCenterIndex = 4;

    this.animationState = BallScrollState.IDLE;

    this.enableScaleAnimation = true;

    this.itemAnimationLeft = 0;
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
      inputRange: [0, 1],
      outputRange: [1, 2]
    });
  };

  setUpBallsAnimation() {
    forEachBallIndex(index => this.setUpBallAnimation(index));
    this.boldTextAnimationValues[4].setValue(1);
    this.boldTextAnimationValues[3].setValue(0.5);
    this.boldTextAnimationValues[5].setValue(0.5);
    this.boldTextAnimationValues[3].setValue(0.25);
    this.boldTextAnimationValues[6].setValue(0.25);
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
            duration: this.animationDuration,
            toValue: 1
          })
        );
      } else if (
        currentPos === BallPositions.POS_3 ||
        currentPos === BallPositions.POS_5
      ) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0.5
          })
        );
      } else if (
        currentPos === BallPositions.POS_2 ||
        currentPos === BallPositions.POS_6
      ) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0.25
          })
        );
      } else {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0
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
        duration: this.animationDuration
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
            duration: this.animationDuration,
            toValue: 1
          })
        );
      } else if (
        currentPos === BallPositions.POS_7 ||
        currentPos === BallPositions.POS_5
      ) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0.5
          })
        );
      } else if (
        currentPos === BallPositions.POS_8 ||
        currentPos === BallPositions.POS_4
      ) {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0.25
          })
        );
      } else {
        animations.push(
          Animated.timing(this.boldTextAnimationValues[index], {
            duration: this.animationDuration,
            toValue: 0
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
        duration: this.animationDuration
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
      this.itemAnimationLeft = this.itemAnimationLeft - 1;
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
      this.itemAnimationLeft = this.itemAnimationLeft - 1;
      this._updateBallLeft();
      this._slideToLeft();
    });
  }

  _onBallClick = index => {
    const currentPosiion = this.posXYList[index].x;
    this.animationDuration = MAX_ANIMATION_DURATION;
    const itemLeft = parseInt(currentPosiion / ITEM_HEIGHT);
    if (itemLeft > 3) {
      this.itemAnimationLeft = itemLeft - 3;
      this.startSlideToLeft();
    } else if (itemLeft < 3) {
      this.itemAnimationLeft = 3 - itemLeft;
      this.startSlideToRight();
    }
  };

  _renderBalls = () => {
    var ballArrayLayouts = [];
    forEachBallIndex(index => {
      ballArrayLayouts.push(
        <BallItemLayout
          key={index}
          ref={ref => (this.ballRefs[index] = ref)}
          onClick={this._onBallClick}
          panHandler={this.panResponders[index].panHandlers}
          ballStyle={[
            styles.square,
            {
              marginTop: index === 0 ? 0 : -ITEM_HEIGHT,
              transform: this.posAnimatedXYValues[index].getTranslateTransform()
            }
          ]}
          textStyle={{
            color: "black",
            fontWeight: "600",
            transform: [{ scale: this.boldTextAnimations[index] }]
          }}
          textValue={this.arrayBallNumber[index]}
          textIndex={index}
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

  isStopped = () =>
    this.animationState === BallScrollState.STOP || this.itemAnimationLeft <= 0;

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
    const newVX = Math.abs(vx);
    if (newVX <= 0.5) {
      this.animationDuration = MAX_ANIMATION_DURATION / 2;
      this.itemAnimationLeft = 2;
    } else if (newVX <= 1) {
      this.animationDuration = MAX_ANIMATION_DURATION / 2;
      this.itemAnimationLeft = MAX_BALL_VISIBLE / 2;
    } else if (newVX <= 2) {
      this.animationDuration = MAX_ANIMATION_DURATION / 4;
      this.itemAnimationLeft = MAX_BALL_VISIBLE;
    } else {
      this.animationDuration = MAX_ANIMATION_DURATION / 4;
      this.itemAnimationLeft = MAX_BALL_VISIBLE * 3;
    }
    if (state === swipeDirections.SWIPE_LEFT) {
      this.startSlideToLeft();
    } else {
      this.startSlideToRight();
    }
  };

  onClick = (state, gestureState) => {
    const { x0 } = gestureState;

    if (x0 < BallPositions.POS_3) {
      this.itemAnimationLeft = 3;
      this.animationDuration = MAX_ANIMATION_DURATION / 3;
      this.startSlideToRight();
    } else if (x0 < BallPositions.POS_4) {
      this.itemAnimationLeft = 2;
      this.animationDuration = MAX_ANIMATION_DURATION / 2;
      this.startSlideToRight();
    } else if (x0 < BallPositions.POS_5) {
      this.animationDuration = MAX_ANIMATION_DURATION;
      this.itemAnimationLeft = 1;
      this.startSlideToRight();
    } else if (x0 < BallPositions.POS_6) {
    } else if (x0 < BallPositions.POS_7) {
      this.itemAnimationLeft = 1;
      this.animationDuration = MAX_ANIMATION_DURATION;
      this.startSlideToLeft();
    } else if (x0 < BallPositions.POS_8) {
      this.itemAnimationLeft = 2;
      this.animationDuration = MAX_ANIMATION_DURATION / 2;
      this.startSlideToLeft();
    } else if (x0 < BallPositions.POS_9) {
      this.itemAnimationLeft = 3;
      this.animationDuration = MAX_ANIMATION_DURATION / 3;
      this.startSlideToLeft();
    }
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
        onClick={this.onClick}
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
