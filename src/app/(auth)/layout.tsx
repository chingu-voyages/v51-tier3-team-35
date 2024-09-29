import React from "react";

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className="w-full min-h-svh  p-2 flex justify-center items-center">
      <section className="w-full md:h-max md:max-w-sm p-6 py-8 md:border border-gray-100 rounded-lg">
        {children}
      </section>
    </main>
  );
};

export default layout;
