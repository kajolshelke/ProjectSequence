import { useEffect, useState } from "react";

const useFirstLoad = (key: string) => {
  const [isFirstLoad, setIsFirstLoad] = useState<boolean | null>(null);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem(key);
    if (hasLoaded) {
      setIsFirstLoad(false); //Refresh request in the tab
    } else {
      sessionStorage.setItem(key, "true");
      setIsFirstLoad(true); //First load request in the tab
    }
  }, [key]);
  return isFirstLoad;
};

export default useFirstLoad;
