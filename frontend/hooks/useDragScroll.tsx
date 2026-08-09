import { useRef } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = ref.current;
    if (!slider) return;
    slider.dataset.isDown = "true";
    slider.dataset.startX = (e.pageX - slider.offsetLeft).toString();
    slider.dataset.scrollLeft = slider.scrollLeft.toString();
  };

  const handleMouseLeaveOrUp = () => {
    if (ref.current) ref.current.dataset.isDown = "false";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = ref.current;
    if (!slider || slider.dataset.isDown !== "true") return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - Number(slider.dataset.startX)) * 1.5;
    slider.scrollLeft = Number(slider.dataset.scrollLeft) - walk;
  };

  return {
    ref,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeaveOrUp,
    onMouseUp: handleMouseLeaveOrUp,
    onMouseMove: handleMouseMove,
  };
}
