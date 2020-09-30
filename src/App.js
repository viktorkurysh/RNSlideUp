import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import SlideUp from './SlideUp';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1874CD',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#1874CD',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
  },
  body: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    backgroundColor: '#1874CD',
    padding: 16,
    paddingHorizontal: 64,
    borderRadius: 12,
  },
  touchableText: {
    color: '#FFF',
    fontSize: 20,
  },
});

function App() {
  const slideUpRef = React.useRef();

  function openModal() {
    slideUpRef.current();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1874CD" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Slide Up</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity style={styles.touchable} onPress={openModal}>
          <Text style={styles.touchableText}>Open</Text>
        </TouchableOpacity>
      </View>
      <SlideUp ref={slideUpRef} />
    </SafeAreaView>
  );
}

export default App;
