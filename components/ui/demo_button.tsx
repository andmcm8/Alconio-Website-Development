import { StarButton } from "@/components/ui/star-button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
 
export default function StarButtonDemo() {
  const { theme } = useTheme();
  const [lightColor, setLightColor] = useState("#FAFAFA");
 
  useEffect(() => {
    setLightColor(theme === "dark" ? "#FAFAFA" : "#FF2056");
  }, [theme]);
 
  return (
    <div>
      <StarButton lightColor={lightColor} className="rounded-3xl">
        Button
      </StarButton>
    </div>
  );
}
