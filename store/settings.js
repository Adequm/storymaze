import Vue from 'vue';
import _ from 'lodash';


export const state = () => ({
  keyEvents: {
    moveUp: [38, 87], // up - W
    moveLeft: [37, 65], // left - A
    moveDown: [40, 83], // bottom - S
    moveRight: [39, 68], // right - D
    takeItem: [69], // E
    dontMove: [88], // X
    changeCameraMode: [77], // M
    rotateCameraLeft: [79], // O
    rotateCameraRight: [80], // P
    changeSlot0: [49],
    changeSlot1: [50],
    changeSlot2: [51],
    dropItem: [71], // G
  },
});


export const getters = {
  moveActionsExtended() {
    return [
      'moveUp', 'moveRight', 'moveDown', 'moveLeft',
      'moveUp', 'moveRight', 'moveDown', 'moveLeft',
    ];
  },
  moveEventsInvert({ keyEvents }, { moveActionsExtended }, { cameraLocal }) {
    const moveEvents = _.pick(keyEvents, moveActionsExtended);
    const otherEvents = _.omit(keyEvents, moveActionsExtended);
    const rotate = 4 - cameraLocal.rotatePlayer / 90;
    return _.reduce(moveEvents, (acc, keycodes, action) => {
      const actionIndex = _.indexOf(moveActionsExtended, action);
      const rotateAction = moveActionsExtended[rotate + actionIndex];
      const invertMoveEvent = { [action]: moveEvents[rotateAction] };
      return _.assign(acc, invertMoveEvent);
    }, otherEvents);
  },

  // { a: [1, 2], b: [2, 3] } => { 1: 'a', 2: 'a', 3: 'b', 4: 'b' }
  keyCodesForEvents({}, { moveEventsInvert }) {
    // const events = _.assign(moveEventsInvert)
    return _.reduce(moveEventsInvert, (acc, codes, action) => {
      return _.chain(codes)
        .map(n => [n, n])
        .fromPairs()
        .mapValues(() => action)
        .assign(acc)
        .value()
    }, {});
  },
};


export const actions = {

};

export const mutations = {
  setKeys({ keyEvents }, newSettings) {
    for(let [action, keys] in _.entries(newSettings))
      Vue.set(keyEvents, action, _.castArray(keys));
  },
};