import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableHighlight, ScrollView, AsyncStorage } from 'react-native';
import style from '../styles/stylecomp.js';
import { StackNavigator } from 'react-navigation';
import { Font } from 'expo';

export default class HomePage extends React.Component {

  static navigationOptions = {header:null}

  constructor () {
    super();
    this.state = {
      id: 0,
      email: "",
      password: "",
      fontLoaded: false,
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Oswald-Bold': require('../Assets/Fonts/Oswald-Bold.ttf'),
      'Oswald-Medium': require('../Assets/Fonts/Oswald-Medium.ttf'),
      'Oswald-Regular': require('../Assets/Fonts/Oswald-Regular.ttf'),
      'Oswald-SemiBold': require('../Assets/Fonts/Oswald-SemiBold.ttf'),
      'SourceSansPro-Light': require('../Assets/Fonts/SourceSansPro-Light.ttf'),
      'SourceSansPro-Regular': require('../Assets/Fonts/SourceSansPro-Regular.ttf')
    });
    this.setState({ fontLoaded: true }, async ()=>{
      try {
        const value = await AsyncStorage.getItem('@UserId:key');
        if (value !== null){
          let userID = parseInt(value);
          console.log(value, "ASYNC STORAGE");
          this.props.navigation.navigate('Main', { userId: userID })
        }
      } catch (error) {
        console.log(error);
      }
    })
  }


  async onSubmit(){
    console.log(this.state);
    let response = await fetch('https://drink-water-api.herokuapp.com/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
    })
    console.log(response);
    let jsonResponse = await response.json()
    this.setState({id:jsonResponse[0].id}, async ()=>{
      let userId = this.state.id.toString()
      try {
        await AsyncStorage.setItem('@UserId:key', userId);
      } catch (error) {
        console.log(error);
      }
      this.props.navigation.navigate('Main', { userId: this.state.id})
    });
  }

  render() {
    return (
      <Image source={require('../styles/resources/drink-water-bg2.png')} style={style.backGround}  resizeMode={Image.resizeMode.sretch}>
      {
      this.state.fontLoaded ? (
        <View style={style.container}>
          <Image source={require('../styles/resources/DRINKWATERlogo.png')} style={{marginBottom: 30}}></Image>
          <View style={style.splashRow}>
            <View>
              <TextInput value={this.state.email} style={style.form} onChangeText={(value) => this.setState({email: value.trim()})} placeholder="Email" />
              <TextInput value={this.state.password} style={style.form}
              onChangeText={(value) => this.setState({password: value.trim()})} placeholder="Password" secureTextEntry={true} />
            </View>
            <View>
              <TouchableHighlight onPress={this.onSubmit}>
                <View style={style.buttonStyle}>
                  <Text style={{color: 'white' , fontFamily: 'SourceSansPro-Regular' }}>Submit</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {this.props.navigation.navigate('SignUp')}}>
                <View style={style.buttonStyle}>
                  <Text style={{color: 'white' , fontFamily: 'SourceSansPro-Regular' }}>Sign Up</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style = {{backgroundColor: "transparent"}}>
            <Text style={{color: 'white' , fontFamily: 'Oswald-SemiBold', fontSize: 45, marginTop: 5 }}>DRINK WATER</Text>
          </View>
        </View>
        ): null
        }
      </Image>
    );
  }
}
