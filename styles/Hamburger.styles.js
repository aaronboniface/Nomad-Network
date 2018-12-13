const drawerStyles = {
  drawer: {
    backgroundColor: 'transparent',
    height: 100,
  },
  main: {
    paddingLeft: 0,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  drawerOverlay: {
    opacity: 0,
  },
  mainOverlay: {
    opacity: 0,
    backgroundColor: 'black',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
  },
  // Check here for native-base drawer styles: https://github.com/root-two/react-native-drawer
  // The native-base drawer component uses the same props as react-native-drawer.
};

export default drawerStyles;