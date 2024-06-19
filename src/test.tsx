import { Bodies, Composite, Engine, Runner } from "matter-js";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const engine = Engine.create();
const runner = Runner.create();

Runner.run(runner, engine);

interface Circle {
  x: number;
  y: number;
}

//These are react "style components"
const Canvas = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: gray;
`;

//These are react "style components"
const Circle = styled.div`
  background-color: yellow;
  border-radius: 50%;
  box-shadow: 2px 2px;
  position: absolute;
`;

//Component PressStart is the parent of components Circle and Canvas
export function PressStart() {
  const ref = useRef<HTMLDivElement>(null); //ref is like usestate but it doesnt rerender
  const dots = useRef<Circle[]>([]); //dots will be a array of circles with a variable number of elements
  //It's not state because you don't want to rerender PressStart everytime a circle is added
  const [, setAnim] = useState(0); //perhaps forces a rerender
  //on every rerender, I expect circle xy to update

  //produce the sideeffect in matterjs engine
  //empty dependency array, effect only runs once
  useEffect(function init() {
    const width = ref.current?.clientWidth ?? 0;
    const height = ref.current?.clientHeight ?? 0;

    const ground = Bodies.rectangle(width / 2, height, width, 50, {
      isStatic: true,
    });
    const ceiling = Bodies.rectangle(width / 2, 0, width, 1, {
      isStatic: true,
    });
    const wallL = Bodies.rectangle(0, height / 2, 1, height, {
      isStatic: true,
    });
    const wallR = Bodies.rectangle(width, height / 2, 50, height, {
      isStatic: true,
    });

    Composite.add(engine.world, [ground, ceiling, wallL, wallR]);
  }, []);

  //produce another sideeffect in matterjs engine
  //this sideeffect defines and calls addDot
  //empty dependency array, effect only runs once
  //the one time this effect runs, it creates 100 balls
  //addDot is recursive, it calls adddot if length is less than 100
  useEffect(() => {
    let unsubscribe: any; //no equals sign?

    function addDot() {
      //the questionmark is optional chaining
      //double questionmark is nullish coalescing??
      //like an or operation or something
      const width = ref.current?.clientWidth ?? 0;
      const height = ref.current?.clientHeight ?? 0;

      const circ = Bodies.circle(
        Math.random() * width * 0.75 + 50,
        Math.random() * height * 0.75 + 50,
        25
      );
      circ.friction = 0.05;
      circ.frictionAir = 0.00005;
      circ.restitution = 0.9;

      //adding circ to matterjs
      Composite.add(engine.world, circ);

      if (dots.current.length < 2) setTimeout(addDot, 300);
    }

    addDot();

    return () => {
      clearTimeout(unsubscribe);
    };
  }, []);

  //produce a sideeffect
  //empty dependency array, only triggers once
  //
  useEffect(function triggerAnimation() {
    let animationFrameId: number;

    function animate() {
      //recursive
      let i = 0;
      for (const dot of Composite.allBodies(engine.world)) {
        //continue means skip ahead to the next loop
        //if isstatic continue to the next animation?
        if (dot.isStatic) continue;

        dots.current[i] = { x: dot.position.x, y: dot.position.y };
        //update the position of dots.current[i]??

        i += 1;
      }

      setAnim((x) => x + 1); //force rerender

      animationFrameId = requestAnimationFrame(animate); //recursive
    }

    animationFrameId = requestAnimationFrame(animate);

    //"unsubscribe function of useEffect. Usually useffect returns nothing"
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    //render Canvas and a bunch of circles
    //rerenders triggered by setAnim
    //.current is like the state
    <Canvas ref={ref}>
      {dots.current.map((dot, key) => (
        <Circle
          key={key}
          style={{ top: dot.y, left: dot.x, width: "50px", height: "50px" }}
        />
      ))}
    </Canvas>
  );
}
