import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Matter from "matter-js";
import "./index.css";

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  Events = Matter.Events,
  MouseConstraint = Matter.MouseConstraint;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
});

var options = {
  friction: 0.5,
  restitution: 0.8,
  label: "ball",
};

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ballShape = Bodies.circle(200, 200, 80, options);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var leftWall = Bodies.rectangle(-1 * 1000, 1000, 60, 1000 * 4, {
  isStatic: true,
});
var rigthWall = Bodies.rectangle(1000 + 1000, 1000, 60, 1000 * 4, {
  isStatic: true,
});

engine.gravity.y = 4;
engine.timing.timeScale = 0.6;

// add all of the bodies to the world
Composite.add(engine.world, [
  boxA,
  boxB,
  ground,
  ballShape,
  leftWall,
  rigthWall,
]);

var canvasMouse = Mouse.create(document.querySelector("canvas"));

var mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse });

Events.on(mConstraint, "mousedown", function (event) {
  console.log(mConstraint, event);

  let x,
    y,
    ball = mConstraint.body;

  if (typeof ball == "undefined" || ball == null) return;
  if (ball.label === "Rectangle Body") return;

  Body.setVelocity(ball, { x: ball.velocity.x, y: 0 });

  x = (ball.position.x - event.mouse.mousedownPosition.x) / 70;

  Body.applyForce(
    ball,
    { x: ball.position.x, y: ball.position.y },
    { x, y: -2 }
  );
});

Events.on(mConstraint, "mouseup", function (event) {
  let x,
    y,
    ball = mConstraint.body;

  if (typeof ball == "undefined" || ball == null) return;
  else if (ball.label === "Rectangle Body") return;

  Body.setVelocity(ball, { x: ball.velocity.x, y: 0 });

  x = (ball.position.x - event.mouse.mousedownPosition.x) / 70;

  Body.applyForce(
    ball,
    { x: ball.position.x, y: ball.position.y },
    { x, y: -2 }
  );
});

Events.on(engine, "collisionStart", function (event) {
  console.log(event);
});

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
