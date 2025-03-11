interface ICommonLoadingProps {
  color?: string;
  size?: string;
}

export const CommonLoading = ({ color, size }: ICommonLoadingProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-transparent">
      <div
        className={`w-${size || "12"} h-${size || "12"} border-4 border-${
          color || "foreground_100"
        } border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};
