import { equipmentAreas } from "@/lib/engine-bay";
import { AreaCard } from "./area-card";

// All five areas: the first (and biggest) spans two columns on wide screens,
// so the grid fills two even rows.
export function AreaGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {equipmentAreas.map((area, index) => (
        <li key={area.slug} className={index === 0 ? "sm:col-span-2" : ""}>
          <AreaCard area={area} wide={index === 0} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
