/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name, ...props }) =>
    React.createElement(Text, props, name ?? "icon");

  return {
    Ionicons: MockIcon,
    FontAwesome: MockIcon,
  };
});

jest.mock('@expo/vector-icons/FontAwesome', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name, ...props }) =>
    React.createElement(Text, props, name ?? "icon");

  return MockIcon;
});

// Mock expo-device
jest.mock('expo-device', () => ({
  osName: 'iOS',
  osVersion: '17.0',
  modelName: 'iPhone 15',
  deviceName: 'Simulator',
}));

// Mock expo-application
jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.0.0',
  nativeBuildVersion: '1',
}));

// Mock React Native Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(dict => dict.ios),
  Version: '17.0',
}));
