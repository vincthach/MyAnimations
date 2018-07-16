/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component, PureComponent } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";

export default class BallItemLayout extends PureComponent {
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

  onClick = () => {
    this.props.onClick(this.props.textIndex);
  };

  render() {
    const { panHandlers, ballStyle, textStyle } = this.props;
    const { textValue } = this.state;
    return (
      <Animated.View {...panHandlers} style={ballStyle}>
        <TouchableWithoutFeedback style={ballStyle[0]} onPress={this.onClick}>
          <Animated.Text style={textStyle}>{textValue}</Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}
