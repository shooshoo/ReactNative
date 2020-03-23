import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, AirbnbRating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}


function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.formRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onComment()}
                        />
                    </View>

                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: 1,
            author: '',
            comment: '',
            date: '',
            showModal: false
        }
    }

    componentDidMount() {
        console.log(JSON.stringify(this.state));

    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    resetForm() {
        this.setState({
            rate: 1,
            author: '',
            comment: '',
            date: '',
            showModal: false
        });
    }

    ratingCompleted(rating) {
        this.setState({
            rate: rating
        });
    }

    onChangeTextAuthor(text) {
        this.setState(
            { author: text }
        );
    }

    onChangeTextComment(text) {

        // const { name, value } = event.target
        this.setState(
            { comment: text }
        );
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleCommit() {
        const dishId = this.props.navigation.getParam('dishId', '');
        console.log("in handle commit");
        console.log(this.state.author);
        console.log(JSON.stringify(this.state));
        this.props.postComment(dishId, this.state.rate, this.state.author, this.state.comment);
        this.resetForm();
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        // const [this.state.author, onChangeText] = React.useState('Useless Placeholder');
        return (
            <ScrollView>
                <RenderDish
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)} // some will check if any item in array is equal to dishId. if yes it wii return true else false
                    onPress={() => this.markFavorite(dishId)}
                    onComment={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}// u need to write it this way like full function definition to bind this function to "this" component
                    onRequestClose={() => this.toggleModal()}
                >
                    <ScrollView >
                        <View style={styles.formRow}>
                            <Rating
                                showRating
                                onFinishRating={(rating) => this.ratingCompleted(rating)}
                                style={{ paddingVertical: 10 }}
                                ratingCount={5}
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Input
                                placeholder='Author'
                                leftIcon={
                                    <Icon
                                        name='face'
                                        size={24}
                                        color='grey'
                                    />
                                }
                                value={this.state.author}
                                onChangeText={(text) => this.onChangeTextAuthor(text)}// u need to write it this way like full function definition to bind this function to "this" component
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Input
                                placeholder='Comment'
                                leftIcon={
                                    <Icon
                                        name='comment'
                                        size={24}
                                        color='grey'
                                    />
                                }
                                value={this.state.comment}
                                onChangeText={text => this.onChangeTextComment(text)}
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Button
                                onPress={() => this.handleCommit()}
                                title="Submit"
                                color="#512DA8"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Button
                                onPress={() => this.resetForm()}
                                title="Cancel"
                                color="grey"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                    </ScrollView>
                </Modal>
            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
