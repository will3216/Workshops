import './gameboard.tag';
import './timer.tag';
import './score.tag';
import './mole-log.tag';
import Store from './store.js';
import {TIMER, ACTION, MOLE} from './consts.js';

// Create a new game
var gamestate = new Store();
//DEBUGGING:
window.gamestate = gamestate;

// render all the tags and pass them gamestate
riot.mount('*', gamestate);

// <timer /> emits TIMER.TICK every second.
gamestate.on(TIMER.TICK, function(seconds) {
  var {lastIndex} = gamestate;
  var index = lastIndex;

  // find a hidden mole
  while (index === lastIndex) {
    index = 0 | Math.random() * 9;
  }

  // hide the last mole we showed and show a new one instead.
  gamestate.trigger(ACTION.MOLE.HIDE, [lastIndex], true);
  gamestate.trigger(ACTION.MOLE.SHOW, [index], true);
  gamestate.update({
    lastIndex: index
  });
});

// when a mole has been 'hit' by the player
// this is different than ACTION.CLICKED, HIT only emits when the mole was clicked and showing.
gamestate.on(MOLE.HIT, function(mole) {
  const src = mole.src;
  let {score, moleLog} = gamestate;
  let log = moleLog[src];

  if (!log) { log = 1; }
  else { log += 1; }

  moleLog[src] = log;

  gamestate.update({
    score: score + 10,
    moleLog: moleLog
  });
});



//
// Auto START
gamestate.trigger('TIMER.START');
