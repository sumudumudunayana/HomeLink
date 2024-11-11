import DeviceController from "./components/DeviceController";
const Index = () => {
  return (
    <div className="h-screen grid grid-flow-col grid-rows-12 w-screen px-4 py-8">
      <div className="row-span-12">
        <DeviceController />
      </div>
    </div>
  );
};

export default Index;
