interface SwitchProps {
  isChecked: boolean;
  setIsChecked: (value: boolean | string) => void;
  cmds?: string[]; // Optional command strings
  disabled?: boolean; // New optional prop for disabling the switch
}

export const Switch: React.FC<SwitchProps> = ({
  isChecked,
  setIsChecked,
  cmds,
  disabled = false, // Default value for disabled
}) => {
  const handleChange = () => {
    if (!disabled) {
      // Prevent changes if disabled is true
      if (cmds && cmds.length === 2) {
        // toggle Manual
        setIsChecked(isChecked ? cmds[0] : cmds[1]);
      } else {
        // toggle Auto
        setIsChecked(!isChecked);
      }
    }
  };

  return (
    <label
      className={`autoSaverSwitch relative inline-flex cursor-pointer select-none items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        name="autoSaver"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
          isChecked ? "bg-lime-200" : "bg-[#CCCCCE]"
        }`}
      >
        <span
          className={`dot h-[18px] w-[18px] rounded-full bg-slate-900 duration-200 ${
            isChecked ? "translate-x-6" : ""
          }`}
        ></span>
      </span>
      <span className="label flex items-center text-sm font-medium text-white">
        <span className="text-xl font-bold text-white pl-3">
          {isChecked ? "ON" : "OFF"}
        </span>
      </span>
    </label>
  );
};
