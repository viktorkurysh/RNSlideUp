/* eslint-disable curly */
import React from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Animated, {
  block,
  useCode,
  set,
  Easing,
  call,
  eq,
  cond,
  diffClamp,
  Value,
  Clock,
  spring,
  startClock,
  stopClock,
  debug,
  lessThan,
  sub,
  and,
  add,
  clockRunning,
  not,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  useValue,
  timing,
} from 'react-native-redash/lib/module/v1';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    left: 0,
    bottom: -250,
    padding: 30,
    alignItems: 'center',
  },
  touchable: {
    backgroundColor: '#1874CD',
    padding: 16,
    paddingHorizontal: 64,
    borderRadius: 12,
    width: '60%',
    alignItems: 'center',
  },
  touchableText: {
    color: '#FFF',
    fontSize: 20,
  },
});

function withSpring(translate, gestureState, translation) {
  const clock = new Clock();
  const config = {
    toValue: new Value(0),
    damping: 40,
    mass: 1,
    stiffness: 400,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
  };
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  return block([
    // cond(eq(gestureState, State.BEGAN), [set(translate, -250)]),
    cond(eq(gestureState, State.ACTIVE), [
      set(translate, diffClamp(sub(translation, 250), -250, 0)),
    ]),
  ]);
}

const SlideUp = React.forwardRef((_, ref) => {
  const [isBackdropShown, setIsBackdropShown] = React.useState(false);
  const [isPanelShown, setIsPanelShown] = React.useState(false);
  const [isCloseButtonPressed, setIsCloseButtonPressed] = React.useState(false);
  const translateY = useValue(0);
  const {gestureHandler, state, translation} = usePanGestureHandler();

  function open() {
    setIsBackdropShown(true);
  }

  function handleCloseButtonPressed() {
    setIsCloseButtonPressed(true);
  }

  React.useEffect(() => (ref.current = open), [ref]);
  console.log('isCloseButtonPressed', isCloseButtonPressed);

  /* show panel */
  useCode(() => {
    if (isBackdropShown && !isPanelShown) {
      return block([
        set(translateY, timing({from: 0, to: -250})),
        cond(eq(translateY, -250), [call([], () => setIsPanelShown(true))]),
      ]);
    }
  }, [isBackdropShown, isPanelShown]);

  /* close slide up if button has  been pressed */
  useCode(() => {
    if (isBackdropShown && isPanelShown && isCloseButtonPressed) {
      return block([
        set(translateY, timing({from: -250, to: 0})),
        cond(eq(translateY, 0), [
          call([], () => {
            setIsCloseButtonPressed(false);
            setIsPanelShown(false);
            setIsBackdropShown(false);
          }),
        ]),
      ]);
    }
  }, [isBackdropShown, isPanelShown, isCloseButtonPressed]);

  /* handle pandel via pan gesture */
  useCode(() => {
    if (isBackdropShown && isPanelShown && !isCloseButtonPressed) {
      return withSpring(translateY, state, translation.y);
    }
  }, [translateY, state, translation.y]);

  if (!isBackdropShown) return null;
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={[styles.panel, {transform: [{translateY}]}]}>
          <TouchableOpacity
            style={styles.touchable}
            onPress={handleCloseButtonPressed}>
            <Text style={styles.touchableText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

export default SlideUp;
