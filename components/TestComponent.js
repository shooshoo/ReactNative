import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView, FlatList, StyleSheet, Modal, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, AirbnbRating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class Test extends Component {

    static navigationOptions = {
        title: 'Test'
    };

    handleViewRef = ref => this.view = ref;

    bounce = () => {
        console.log("this.view: ",this.view);
        this.view.bounce(2000);
        console.log("after bounce");
    }

    render() {
        return (
            <View style={{ margin: 60 }}>
                <TouchableWithoutFeedback onPress={this.bounce}>
                    <Animatable.View ref={this.handleViewRef}>
                        <Text>Bounce me!</Text>
                    </Animatable.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default Test;