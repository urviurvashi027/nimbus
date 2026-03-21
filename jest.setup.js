import 'react-native-gesture-handler/jestSetup';

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
