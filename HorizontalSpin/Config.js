import React from "react";
import { Dimensions } from "react-native";

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
const MAX_ANIMATION_DURATION = 700;
const MIN_ANIMATION_DURATION = 100;

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

const forEachBallIndex = callback => {
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

const BallScrollState = {
  IDLE: 1,
  RUNNING: 2,
  STOP: 3
};

export {
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
};
