var common = require('../common');
var assert = require('assert');
var test = require('utest');
var sinon = require('sinon');
var control = require(common.lib + '/control');
var message = require(common.lib + '/control/message');

test('control', {
  before: function() {
    this.clock = sinon.useFakeTimers();
    this.control = control();
    this.config = this.control.config;
    this.atMessageUdpStream = this.control.atMessageUdpStream;
    this.controlMessageSequence = this.control.controlMessageSequence;
  },

  after: function() {
    this.clock.restore();
  },

  'constructor': function() {
    assert.equal(this.control.fly, false);
    assert.equal(this.control.emergency, false);
    assert.equal(this.control.leftRight, 0);
    assert.equal(this.control.frontBack, 0);
    assert.equal(this.control.upDown, 0);
    assert.equal(this.control.clockSpin, 0);
  },

  'sends next message to udp stream every config.timeout': function() {
    var msg = message();

    sinon.stub(this.atMessageUdpStream, 'write');
    sinon.stub(this.controlMessageSequence, 'next').returns(msg);

    this.clock.tick(this.config.controlInterval);

    assert.equal(this.atMessageUdpStream.write.callCount, 1);
    var args = this.atMessageUdpStream.write.getCall(0).args;
    assert.strictEqual(args.length, 1);
    assert.strictEqual(args[0], msg);
  },

  'toJSON: returns a copy of just the data': function() {
    var json = this.control.toJSON();

    // check one value
    assert.strictEqual(json.leftRight, 0);

    // make sure modifying it does not modify the control
    json.leftRight = 5;
    assert.strictEqual(this.control.leftRight, 0);

    // also make sure functions were not copied
    assert.strictEqual(json.toJSON, undefined);
  },
});