

// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

/**
 * @constructor
 */
webgl.Program = function(vertex, fragment) {
  /**
   * @type {webgl.Shader}
   */
  this.vertex_ = vertex;

  /**
   * @type {webgl.Shader}
   */
  this.fragment_ = fragment;
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.create = function(gl) {
  this.vertex_.create(gl);
  this.fragment_.create(gl);
  this.handle = gl.createProgram();
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.dispose = function(gl) {
  gl.detachShader(this.handle, this.vertex_.handle);
  this.vertex_.dispose(gl);
  gl.detachShader(this.handle, this.fragment_.handle);
  this.fragment_.dispose(gl);
  gl.deleteProgram(this.handle);
  this.handle = null;
};


/**
 * @param {WebGLRenderingContext} gl
 */
webgl.Program.prototype.link = function(gl) {
  this.vertex_.compile(gl);
  gl.attachShader(this.handle, this.vertex_.handle);
  this.fragment_.compile(gl);
  gl.attachShader(this.handle, this.fragment_.handle);
  gl.linkProgram(this.handle);
  if (!gl.getProgramParameter(this.handle, gl.LINK_STATUS)) {
    var log = gl.getProgramInfoLog(this.handle);
    this.dispose(gl);
    throw new Error(log);
  }
};
