import { Link } from "@inertiajs/react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  group?: string;
}

interface GroupConfig {
  [key: string]: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
}

export function NavMain({ 
  groupedItems,
  groupConfig,
  isActive
}: {
  groupedItems: Record<string, NavItem[]>;
  groupConfig: GroupConfig;
  isActive: (href: string) => boolean;
}) {
  const ungroupedItems = groupedItems['ungrouped'] || [];
  const groupOrder = ['expert', 'data', 'analytics'];

  return (
    <div className="space-y-4">
      {ungroupedItems.length > 0 && (
        <SidebarGroup>
          <SidebarMenu>
            {ungroupedItems.map((item) => {
              const isItemActive = isActive(item.href);
              
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      {item.icon && (
                        <item.icon className={`h-4 w-4 ${
                          isItemActive 
                            ? 'text-primary' 
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`} />
                      )}
                      <span className={`text-sm font-medium ${
                        isItemActive 
                          ? 'text-primary' 
                          : 'text-foreground'
                      }`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {groupOrder.map((groupKey, groupIndex) => {
        const items = groupedItems[groupKey];
        const config = groupConfig[groupKey];
        
        if (!items || items.length === 0) return null;

        const GroupIcon = config?.icon;

        return (
          <div key={groupKey}>
            {(ungroupedItems.length > 0 || groupIndex > 0) && <Separator className="mx-4" />}
            
            <SidebarGroup>
              {config && (
                <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  {GroupIcon && <GroupIcon className={`h-4 w-4 ${config.color}`} />}
                  <span className={config.color}>{config.title}</span>
                </SidebarGroupLabel>
              )}
              
              <SidebarMenu>
                {items.map((item) => {
                  const isItemActive = isActive(item.href);
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isItemActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon className={`h-4 w-4 ${
                              isItemActive 
                                ? 'text-primary' 
                                : 'text-muted-foreground group-hover:text-foreground'
                            }`} />
                          )}
                          <span className={`text-sm font-medium ${
                            isItemActive 
                              ? 'text-primary' 
                              : 'text-foreground'
                          }`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </div>
        );
      })}
    </div>
  );
}