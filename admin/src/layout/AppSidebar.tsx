import { Link, NavLink } from "react-router";
import { GridIcon, ListIcon, PieChartIcon, PlugInIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { resourceGroups, resourceMap } from "../lib/resource-config";

const groupIcons = {
  content: <ListIcon />,
  competition: <PieChartIcon />,
  commerce: <GridIcon />,
  system: <PlugInIcon />,
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center rounded-xl px-3 py-2 text-sm transition",
    isActive
      ? "bg-brand-500 text-white"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
  ].join(" ");

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const isWide = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-4 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0 ${
        isWide ? "w-[290px]" : "w-[92px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} left-0 top-0 z-50 lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex py-8 ${isWide ? "justify-start" : "justify-center"}`}>
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo/logo-icon.svg" alt="Tarkam" width={36} height={36} />
          {isWide ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Tarkam Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">API Control Center</p>
            </div>
          ) : null}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="space-y-2">
          <NavLink to="/" end className={linkClassName}>
            <span className="mr-3 inline-flex size-5 items-center justify-center"><GridIcon /></span>
            {isWide ? <span>Dashboard</span> : null}
          </NavLink>
        </div>

        <div className="mt-8 space-y-6">
          {resourceGroups.map((group) => (
            <div key={group.key}>
              <div className={`mb-3 flex items-center gap-3 ${isWide ? "" : "justify-center"}`}>
                <span className="inline-flex size-5 items-center justify-center text-gray-400">
                  {groupIcons[group.key as keyof typeof groupIcons]}
                </span>
                {isWide ? (
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {group.label}
                  </h2>
                ) : null}
              </div>

              <div className="space-y-1">
                {group.resourceKeys.map((resourceKey) => {
                  const resource = resourceMap[resourceKey];
                  return (
                    <NavLink
                      key={resource.key}
                      to={`/resources/${resource.key}`}
                      className={linkClassName}
                      title={resource.title}
                    >
                      <span className="mr-3 inline-flex size-2 rounded-full bg-current opacity-70" />
                      {isWide ? <span>{resource.title}</span> : null}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
