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

function withSpring(
  translate,
  gestureState,
  translation,
  setIsOpened,
  setIsBackdropVisible,
  setIsPanelVisible,
) {
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
    cond(
      eq(gestureState, State.ACTIVE),
      [set(translate, diffClamp(sub(translation, 250), -250, 0))],
      [
        cond(eq(gestureState, State.END), [
          cond(
            and(not(clockRunning(clock)), lessThan(translation, 250 / 2)),
            [
              debug('translation', translation),
              // set(state.position, 0),
              set(config.toValue, -250),
              startClock(clock),
              spring(clock, state, config),
              set(translate, state.position),
              cond(state.finished, [
                stopClock(clock),
                set(gestureState, State.UNDETERMINED),
              ]),
            ],
            [
              // set(config.toValue, 0),
              // spring(clock, state, config),
              // set(translate, state.position),
              // cond(and(eq(state.position, 0), state.finished), [
              //   call([], () => {
              //     setIsOpened(false);
              //     setIsBackdropVisible(false);
              //     setIsPanelVisible(false);
              //   }),
              //   stopClock(clock),
              // ]),
            ],
          ),
        ]),
      ],
    ),
  ]);
}

const SlideUp = React.forwardRef((_, ref) => {
  const [isOpened, setIsOpened] = React.useState(false);
  function open() {
    setIsOpened(true);
  }

  React.useEffect(() => {
    ref.current = open;
  }, [ref]);
  const [isBackdropVisible, setIsBackdropVisible] = React.useState(false);
  const [isPanelVisible, setIsPanelVisible] = React.useState(false);
  const [isCloseButtonPressed, setIsCloseButtonPressed] = React.useState(false);
  const {gestureHandler, state, translation} = usePanGestureHandler();
  const translateY = useValue(0);

  function handleCloseButtonPressed() {
    setIsCloseButtonPressed(true);
  }

  React.useEffect(() => {
    if (isOpened) setIsBackdropVisible(true);
  }, [isOpened]);

  useCode(() => {
    if (isOpened && !isPanelVisible) {
      return block([
        set(
          translateY,
          timing({from: 0, to: -250, duratin: 250, easing: Easing.linear}),
        ),
        cond(
          eq(translateY, -250),
          call([], () => setIsPanelVisible(true)),
        ),
      ]);
    }
  }, [isOpened, isPanelVisible]);

  useCode(() => {
    if (isCloseButtonPressed && isPanelVisible) {
      return block([
        set(
          translateY,
          timing({from: -250, to: 0, duratin: 250, easing: Easing.linear}),
        ),
        cond(eq(translateY, 0), [
          call([], () => {
            setIsBackdropVisible(false);
            setIsCloseButtonPressed(false);
            setIsOpened(false);
            setIsPanelVisible(false);
          }),
        ]),
      ]);
    }
  }, [isCloseButtonPressed, isPanelVisible]);

  useCode(() => {
    if (isPanelVisible && !isCloseButtonPressed) {
      return withSpring(
        translateY,
        state,
        translation.y,
        setIsOpened,
        setIsBackdropVisible,
        setIsPanelVisible,
      );
    }
  }, [state, isPanelVisible, isCloseButtonPressed, translateY, translation.y]);

  console.log('isOpened', isOpened);
  console.log('isBackdropVisible', isBackdropVisible);
  console.log('isPanelVisible', isPanelVisible);
  console.log('isCloseButtonPressed', isCloseButtonPressed);

  if (!isBackdropVisible) return null;
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
