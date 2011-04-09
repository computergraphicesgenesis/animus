// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @constructor
 */
animus.Visitor = function() {};


/**
 * @param {animus.Node} node
 */
animus.Visitor.prototype.traverse = function(node) {
  node.accept(this);
};


/**
 * @param {animus.Node} node
 */
animus.Visitor.prototype.visitNode = animus.nullFunction;


/**
 * @param {animus.Composite} composite
 */
animus.Visitor.prototype.visitComposite = function(composite) {
  var visitor = this;
  composite.children.forEach(function(child) {
    child.accept(visitor);
  });
};


/**
 * @param {animus.Transform} transform
 */
animus.Visitor.prototype.visitTransform = animus.nullFunction;