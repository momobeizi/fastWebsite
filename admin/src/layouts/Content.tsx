interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return (
    <div className="flex-1 mx-2.5 mb-2.5 overflow-x-hidden overflow-y-auto min-h-0">
      {children}
    </div>
  );
};

export default Content;