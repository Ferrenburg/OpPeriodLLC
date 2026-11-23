import { equipmentAreas } from "@/lib/engine-bay";
import { AreaCard } from "./area-card";

// Every area as a tile. When it evens out the rows (five areas), the first
// tile spans two columns; with six, it's a plain three by two grid.
export function AreaGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const wideFirst = equipmentAreas.length % 3 === 2;
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {equipmentAreas.map((area, index) => (
        <li key={area.slug} className={wideFirst && index === 0 ? "sm:col-span-2" : ""}>
          <AreaCard area={area} index={index} wide={wideFirst && index === 0} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
