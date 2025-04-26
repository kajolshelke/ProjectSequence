import { useEffect } from "react";

const test = () => {
  useEffect(() => {
    const isReloaded = sessionStorage.getItem("test-reload");

    if (isReloaded) {
      // code runs when page is refreshed
    } else {
      // code runs when page loads for the first time

      sessionStorage.setItem("test-reload", "true");
    }
  }, []);
  return <div>test</div>;
};

export default test;
