import { router } from 'expo-router'
import React from 'react'
import { Button, Text, View } from 'react-native'

const SingIn = () => {
  return (
    <View>
      <Text>SingIn</Text>
      <Button title="Sign Up" onPress={() => router.push('/sign-up')} />
    </View>
  )
}

export default SingIn