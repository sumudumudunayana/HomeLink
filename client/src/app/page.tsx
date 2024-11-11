import DeviceController from "./components/DeviceController";
const Index = () => {
  return (
    <div className="h-screen grid grid-flow-col grid-rows-12 w-screen px-4 py-8">
      <h1 className="row-span-1 text-4xl font-bold text-start w-5/6 mx-auto pb-5 text-white rounded-lg">
        {"<NAME PLACEHOLDER>"}
      </h1>
      <div className="row-span-11">
        <DeviceController />
      </div>
    </div>
  );
};

export default Index;
