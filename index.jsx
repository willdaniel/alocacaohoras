import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItems from 'menu-items';
import useAuth from 'hooks/useAuth';

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
              // Only include the parent item if it's a group or if it's a collapse item with children remaining.
              if (item.type === 'group' || filteredChildren.length > 0) {
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
      // Garante que o menu esteja vazio enquanto o usuário não é carregado.
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
            Erro nos Itens de Menu
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;