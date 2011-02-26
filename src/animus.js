// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

animus.load = function() {
  var canvas = animus.global.document.getElementById('c');
  canvas.width = 640;
  canvas.height = 640;
  new webgl.App(window, new animus.Renderer(new animus.Keys(document)))
      .install(canvas);
};
window.onload = animus.load;


/**
 * @constructor
 */
animus.Renderer = function(keys) {
  /**
   * @type {animus.Keys}
   */
  this.keys_ = keys;

  /**
   * @type {WebGLProgram}
   */
  this.p_ = null;

  /**
   * @type {WebGLBuffer}
   */
  this.b_ = null;


  /**
   * @type {animus.Node}
   */
  this.root_ = null;


  /**
   * @type {animus.Visitor}
   */
  this.visitor_ = null;
};
animus.inherits(animus.Renderer, webgl.Renderer);


/**
 * @param {WebGLRenderingContext} gl
 * @param {number} width
 * @param {number} height
 */
animus.Renderer.prototype.onChange = function(gl, width, height) {
  gl.viewport(0, 0, width, height);
};


var N = 8;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onCreate = function(gl) {
  this.keys_.install();
  var vertex = new webgl.Shader(
      gl.VERTEX_SHADER, animus.global.document.getElementById('v').text);
  var fragment = new webgl.Shader(
      gl.FRAGMENT_SHADER, animus.global.document.getElementById('f').text);
  this.p_ = new webgl.Program(vertex, fragment);
  this.p_.create(gl);
  this.p_.link(gl);
  gl.useProgram(this.p_.handle);

  this.b_ = gl.createBuffer();

  this.p_.rotation =
      gl.getUniformLocation(this.p_.handle, 'rotation');
  this.p_.translation =
      gl.getUniformLocation(this.p_.handle, 'translation');

  this.p_.position = gl.getAttribLocation(this.p_.handle, 'position');
  this.p_.aColor = gl.getAttribLocation(this.p_.handle, 'aColor');

  var data = [
    0.0, 0.0, 0.0,
    1/N, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 1/N, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 1/N,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ];

  var a = new Float32Array(data);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.b_);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var segment = new animus.Geometry(this.b_, this.p_);
  this.root_ = new animus.Transform();
  this.root_.children.push(segment);
  this.joint_ = [];
  for (var i = 0; i < N-1; ++i) {
    var joint = new animus.Transform();
    joint.translation = new animus.Vector(0, 1/N, 0);
    joint.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.K, Math.PI/8 /* (i+1)*/);
    joint.children.push(segment);
    if (i == 0) {
      this.root_.children.push(joint);
    } else {
      this.joint_[i-1].children.push(joint);
    }
    this.joint_[i] = joint;
  }

  this.root_.translation = new animus.Vector(0, -0.5, 0);

  this.visitor_ = new animus.WebGlVisitor(gl);
};


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDestroy = animus.nullFunction;


/**
 * @param {WebGLRenderingContext} gl
 */
animus.Renderer.prototype.onDraw = function(gl) {
  this.keys_.update();
  if (this.keys_.isPressed(animus.Keys.Key.LEFT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, Math.PI/128).times(this.root_.rotation);
//  for (var i = 0; i < N-1; ++i) {
//    this.joint_[i].rotation = animus.Quaternion.fromAxisAngle(
//        animus.Vector.J, Math.PI/128 /*(i+1)*/).
//            times(this.joint_[i].rotation);
//  }
  }
  if (this.keys_.isPressed(animus.Keys.Key.RIGHT)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.J, -Math.PI/128).times(this.root_.rotation);
//  for (var i = 0; i < N-1; ++i) {
//    this.joint_[i].rotation = animus.Quaternion.fromAxisAngle(
//        animus.Vector.J, -Math.PI/128 /*(i+1)*/).
//            times(this.joint_[i].rotation);
//  }
  }
  if (this.keys_.isPressed(animus.Keys.Key.UP)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, Math.PI/128).times(this.root_.rotation);
//  for (var i = 0; i < N-1; ++i) {
//    this.joint_[i].rotation = animus.Quaternion.fromAxisAngle(
//        animus.Vector.I, Math.PI/128 /*(i+1)*/).
//            times(this.joint_[i].rotation);
//  }
  }
  if (this.keys_.isPressed(animus.Keys.Key.DOWN)) {
    this.root_.rotation = animus.Quaternion.fromAxisAngle(
        animus.Vector.I, -Math.PI/128).times(this.root_.rotation);
//  for (var i = 0; i < N-1; ++i) {
//    this.joint_[i].rotation = animus.Quaternion.fromAxisAngle(
//        animus.Vector.I, -Math.PI/128 /*(i+1)*/).
//            times(this.joint_[i].rotation);
//  }
  }
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  this.root_.accept(this.visitor_);
  gl.flush();
};
