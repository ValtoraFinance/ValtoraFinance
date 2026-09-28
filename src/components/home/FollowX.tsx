import { BRAND } from "@/config/brand";
import { XIcon } from "@/components/icons";

/** The project speaks only on X, so every "stay updated" slot points there. */
export function FollowX() {
  return (
    <a href={BRAND.x} target="_blank" rel="noreferrer" className="btn btn-light mt-10 px-5 py-3.5 text-[15px]">
      <XIcon /> Follow {BRAND.xHandle}
    </a>
  );
}
