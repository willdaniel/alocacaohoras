import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { 
  IconDashboard, 
  IconKey, 
  IconUsers, 
  IconClipboardHeart, 
  IconBalloon, 
  IconAddressBook, 
  IconChecklist,
  IconFileCertificate, 
  IconHeartRateMonitor, 
  IconFileText,  IconUserSearch,
  IconActivity, 
  IconLicense, 
  IconCash,
  IconSettings,
  IconBuilding,
  IconCreditCard,
  IconReceipt,
  IconMoodSad,
  IconFileInvoice,
  IconUserPlus,
  IconUserOff,
  IconUserX,
  IconCalendarEvent,
  IconClock,
  IconFolder,
  IconNews
} from '@tabler/icons-react'; 

const iconMap = {
  IconDashboard: IconDashboard,
  IconKey: IconKey,
  IconUsers: IconUsers,
  IconClipboardHeart: IconClipboardHeart,
  IconBalloon: IconBalloon,
  IconAddressBook: IconAddressBook,
  IconChecklist: IconChecklist,
  IconFileCertificate: IconFileCertificate,
  IconHeartRateMonitor: IconHeartRateMonitor,
  IconFileText: IconFileText,
  IconActivity: IconActivity,
  IconLicense: IconLicense,
  IconCash: IconCash,
  IconSettings: IconSettings,
  IconBuilding: IconBuilding,
  IconCreditCard: IconCreditCard,
  IconReceipt: IconReceipt,
  IconMoodSad: IconMoodSad,
  IconFileInvoice: IconFileInvoice,
  IconUserPlus: IconUserPlus,
  IconUserOff: IconUserOff,
  IconUserX: IconUserX,
  IconCalendarEvent: IconCalendarEvent,
  IconClock: IconClock,
  IconFolder: IconFolder,
  IconNews: IconNews
};

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

  const IconComponent = iconMap[item.icon];
  
  const itemIcon = IconComponent ? (
    <IconComponent stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon sx={{ width: 6, height: 6 }} fontSize="inherit" />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  useEffect(() => {
    if (document.location.pathname.includes(item.url)) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
  }, [pathname, dispatch, item.id, item.url]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`
      }}
      selected={customization.isOpen.includes(item.id)}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant={customization.isOpen.includes(item.id) ? 'h5' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;