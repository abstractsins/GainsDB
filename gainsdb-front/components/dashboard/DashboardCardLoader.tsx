import { useEffect, useState } from "react";

export default function DashboardCardLoader() {
  const [loaderText, setLoaderText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      switch (loaderText.toLowerCase()) {
        case "":
          setLoaderText(".");
          break;
        case ".":
          setLoaderText("..");
          break;
        case "..":
          setLoaderText("...");
          break;
        case "...":
          setLoaderText("....");
          break;
        case "....":
          setLoaderText(".....");
          break;
        case ".....":
          setLoaderText("......");
          break;
        case "......":
          setLoaderText(".......");
          break;
        case ".......":
          setLoaderText("");
          break;
      }
    }, 150);
  });

  return <>{loaderText}</>;
}
