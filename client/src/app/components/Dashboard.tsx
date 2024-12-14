import Controller from "./Controller";
import Greeting from "./Greeting";

export default () => (
  <div className="grid grid-rows-3 grid-flow-col h-full gap-4 w-5/6 mx-auto pb-5">
    <Controller />
    <Greeting />
  </div>
);
