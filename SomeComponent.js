import React, { Component } from "react";
import { View, Text } from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "./HorizontalSpin/GestureRecognizer";

class SomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myText: "I'm ready to get swiped!",
      gestureName: "none",
      backgroundColor: "#fff"
    };
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
      >
        <Text>{this.state.myText}</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer>
    );
  }
}

export default SomeComponent;
