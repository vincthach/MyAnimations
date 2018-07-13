/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component, PureComponent } from "react";
import { Animated } from "react-native";

export default class BallItemLayout extends Component {
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
