import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'


const Loading = () => {
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
      <ActivityIndicator size='large'/>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})