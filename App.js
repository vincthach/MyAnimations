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
import HorizontalSpin from "./HorizontalSpin";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <HorizontalSpin ref="horizontalSpin1" />
        <Button
          style={styles.row}
          title="Left Animation"
          onPress={() => this.refs["horizontalSpin1"].startSlideToRight()}
        />

        <Button
          title="Stop Animation"
          onPress={() => this.refs["horizontalSpin1"].stop()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#F5FCFF"
  },
  row: {
    marginTop: 300
  }
});
