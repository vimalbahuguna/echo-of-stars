import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labelMap: Record<string, string> = {
  academy: "Academy",
  astrology: "Astrology",
  vedic: "Vedic",
  about: "About",
  vision: "Vision",
  curriculum: "Curriculum",
  syllabus: "Syllabus",
};

const AcademyBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  // Only render for academy-related paths
  if (!segments.length || segments[0] !== "academy") return null;

  const paths = segments.map((_, idx) => "/" + segments.slice(0, idx + 1).join("/"));

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {segments.map((seg, idx) => {
          const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
          const to = paths[idx];
          const isLast = idx === segments.length - 1;
          return (
            <React.Fragment key={to}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AcademyBreadcrumbs;