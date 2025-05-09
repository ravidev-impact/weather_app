// Mock for react-native-reanimated
module.exports = {
  default: {
    call: () => {},
    createAnimatedComponent: component => component,
    View: 'AnimatedView',
    Text: 'AnimatedText',
    Image: 'AnimatedImage',
    ScrollView: 'AnimatedScrollView',
    FlatList: 'AnimatedFlatList',
    useSharedValue: initial => ({value: initial}),
    useAnimatedStyle: () => ({}),
    useAnimatedRef: () => ({current: null}),
    useDerivedValue: fn => ({value: fn()}),
    withTiming: toValue => toValue,
    withSpring: toValue => toValue,
    withDelay: (_, animation) => animation,
    interpolate: () => 0,
    Extrapolate: {CLAMP: 'clamp'},
    measure: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0,
    }),
    event: () => {},
  },
  Value: function (val) {
    this.value = val;
  },
  Node: function () {},
};
