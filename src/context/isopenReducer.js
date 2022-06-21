const IsopenReducer = (state, action) => {
    switch (action.type) {
      case "SHOW": {
        return {
          isOpen: true,
        };
      }
      case "HIDE": {
        return {
          isOpen: false,
        };
      }
      case "TOGGLE": {
        return {
          isOpen: !state.isOpen,
        };
      }
      default:
        return state;
    }
  };
  
  export default IsopenReducer;
  