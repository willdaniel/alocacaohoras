import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

import { 
    IconUsers, 
    IconClipboardHeart, 
    IconSettings
    // Adicionar outros ícones de itens "collapse" se houver
} from '@tabler/icons-react';

const iconMap = {
    IconUsers: IconUsers,
    IconClipboardHeart: IconClipboardHeart,
    IconSettings: IconSettings
    // Adicionar outros ícones de itens "collapse" se houver
};


// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    console.log(`NavCollapse for ${menu.title}: children`, menu.children); // Debugging line
    console.log(`NavCollapse for ${menu.title}: open state`, open); // Debugging line

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };
    
    const { pathname } = useLocation();

    useEffect(() => {
        const a = menu.children?.some((item) => {
            return item.url && pathname.includes(item.url);
        });
        if (a) {
            setOpen(true);
            setSelected(menu.id);
        }
    }, [pathname, menu.children, menu.id]);


    const IconComponent = iconMap[menu.icon];
    const menuIcon = IconComponent ? (
        <IconComponent stroke={1.5} size="1.3rem" />
    ) : (
        <FiberManualRecordIcon sx={{ width: level > 1 ? 6 : 8, height: level > 1 ? 6 : 8 }} fontSize="inherit" />
    );
    
    // Mapeia os filhos do item "collapse"
    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
                selected={selected === menu.id}
                onClick={handleClick}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
                    {menuIcon}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={selected === menu.id ? 'h5' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
                            {menu.title}
                        </Typography>
                    }
                />
                {open ? (
                    <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menus}
                </List>
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
