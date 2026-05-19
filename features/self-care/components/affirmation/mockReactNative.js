/* eslint-env jest */
const React = require("react");

const windowMetrics = { width: 390, height: 844, scale: 2, fontScale: 1 };

function createHostComponent(name) {
  const Component = React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children)
  );

  Component.displayName = name;
  return Component;
}

const View = createHostComponent("View");
const Text = createHostComponent("Text");
const Pressable = createHostComponent("Pressable");
const TouchableOpacity = createHostComponent("TouchableOpacity");
const ScrollView = createHostComponent("ScrollView");
const TouchableWithoutFeedback = ({ children }) => children;
TouchableWithoutFeedback.displayName = "TouchableWithoutFeedback";

const FlatList = React.forwardRef(
  (
    {
      data = [],
      renderItem,
      ListHeaderComponent,
      ListEmptyComponent,
      contentContainerStyle,
      style,
      children,
      ...props
    },
    ref
  ) => {
    React.useImperativeHandle(ref, () => ({
      scrollToIndex: jest.fn(),
      scrollToOffset: jest.fn(),
    }));

    const items = Array.isArray(data) ? data : [];

    return React.createElement(
      View,
      { ...props, style },
      ListHeaderComponent ?? null,
      React.createElement(
        View,
        { style: contentContainerStyle },
        items.length > 0 && typeof renderItem === "function"
          ? items.map((item, index) =>
              React.createElement(
                React.Fragment,
                { key: item?.id ?? String(index) },
                renderItem({ item, index })
              )
            )
          : null,
        items.length === 0 ? ListEmptyComponent ?? null : null,
        children
      )
    );
  }
);

FlatList.displayName = "FlatList";

const AnimatedView = View;

const AnimatedValue = function (value) {
  this._value = value;
  this.setValue = jest.fn((next) => {
    this._value = next;
  });
  this.addListener = jest.fn();
  this.removeAllListeners = jest.fn();
  this.stopAnimation = jest.fn();
  this.interpolate = jest.fn(() => this);
};

const Animated = {
  Value: AnimatedValue,
  View: AnimatedView,
  timing: jest.fn(() => ({
    start: jest.fn((callback) => callback?.({ finished: true })),
  })),
  parallel: jest.fn(() => ({
    start: jest.fn((callback) => callback?.({ finished: true })),
  })),
};

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => style,
  absoluteFillObject: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

const Dimensions = {
  get: jest.fn(() => windowMetrics),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const Platform = {
  OS: "ios",
  select: (options) => options?.ios ?? options?.default,
};

const Easing = {
  in: (value) => value,
  out: (value) => value,
  quad: "quad",
  cubic: "cubic",
};

const Modal = ({ visible, children }) =>
  visible ? React.createElement(View, null, children) : null;
Modal.displayName = "Modal";

module.exports = {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions: () => windowMetrics,
};
