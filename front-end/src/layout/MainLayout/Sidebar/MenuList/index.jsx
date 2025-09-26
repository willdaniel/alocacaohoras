import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItems from 'menu-items';
import useAuth from 'hooks/useAuth'; // Make sure this import path is correct

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const { user } = useAuth();
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (user && user.role && menuItems.items) {
      const filterByPermissions = (items, userRole) => {
        return items.reduce((acc, item) => {
          // An item is allowed if it has no permissions array or if the user's role is in the permissions array.
          const hasPermission = !item.permissions || item.permissions.includes(userRole);

          if (hasPermission) {
            // If the item has children, filter them recursively.
            if (item.children) {
              const filteredChildren = filterByPermissions(item.children, userRole);
              // Only include the parent item if it has children remaining after filtering.
              if (filteredChildren.length > 0) {
                acc.push({ ...item, children: filteredChildren });
              }
            } else {
              // If the item has no children, just include it.
              acc.push(item);
            }
          }
          return acc;
        }, []);
      };
      setFilteredItems(filterByPermissions(menuItems.items, user.role));
    } else {
      // Ensures the menu is empty while the user is loading.
      setFilteredItems([]);
    }
  }, [user]);

  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;