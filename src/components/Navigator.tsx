import {
    Avatar,
    makeStyles,
    Text,
    tokens
} from '@fluentui/react-components';
import {
    bundleIcon,
    SignOut20Regular, SignOutFilled, TabGroup20Filled, TabGroup20Regular
} from '@fluentui/react-icons';
import {
    NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, type OnNavItemSelectData
} from '@fluentui/react-nav-preview';
import { observer } from 'mobx-react';
import { type JSX, type SyntheticEvent, useEffect, useRef } from 'react';

import logo from '../assets/logo.png';
import { useCredentialStore, useNavigationStore, useViewStore } from '../stores/storeHooks';
import { views } from '../stores/ViewStore';
import Stack from './helper/Stack';

// styles for navigator
const useStyles = makeStyles({
    root: {
        overflow: 'hidden',
        display: 'flex',
    },
    nav: {
        minWidth: '200px',
    },
    noHover: {
        ':hover': {
            backgroundColor: 'transparent',
            color: 'inherit',
            cursor: 'default',
        },
    },
    warningButton: {
        color: tokens.colorStatusDangerForeground1,
        ':hover': {
            backgroundColor: tokens.colorStatusDangerBackground2,
        },
    },
});

// bundled icons
const SignOut = bundleIcon(SignOutFilled, SignOut20Regular);
const TabGroup = bundleIcon(TabGroup20Filled, TabGroup20Regular);

const Navigator = observer((): JSX.Element => {
    const { username } = useCredentialStore();
    const { isDrawerOpen, setIsDrawerOpen } = useNavigationStore();
    const styles = useStyles();
    const { selectedView, setSelectedView } = useViewStore();

    const drawerRef = useRef<HTMLDivElement>(null);

    const viewNavItems = views.map((view, index) => (
        <NavItem icon={<TabGroup />} key={index} value={view.viewKey} disabled={view.viewKey === 'flow'} onClick={() => setSelectedView(view.viewKey)}>
            {view.label}
            {/* <div style={{ marginLeft: 'auto' }}>
                <Tooltip content="Bearbeiten" relationship="label">
                    <Edit20Regular
                        aria-label="Bearbeiten"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent NavItem click
                            onClickEdit(project.id);
                        }}
                    />
                </Tooltip>
            </div> */}
        </NavItem>
    ));

    // Close the drawer when the user clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsDrawerOpen(false);
            }
        };

        if (isDrawerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDrawerOpen]);

    const onNavItemSelect = (_: Event | SyntheticEvent<Element, Event>, data: OnNavItemSelectData): void => {
        // close the drawer when anything is selected
        setIsDrawerOpen(false);
        if (data.value === 'new') return;
        setSelectedView(data.value);
    };

    return (
        <div className={styles.root}>
            <NavDrawer
                onNavItemSelect={onNavItemSelect}
                selectedValue={selectedView}
                defaultSelectedCategoryValue=""
                open={isDrawerOpen}
                className={styles.nav}
                density="medium"
                ref={drawerRef}
            >
                <NavDrawerHeader>
                    <Stack style={{ alignItems: 'center', padding: '8px' }}>
                        <img src={logo} alt="logo" height={24} />
                        <Text weight='semibold' size={500}>BaraQ</Text>
                    </Stack>
                </NavDrawerHeader>
                <NavDivider />
                <NavDrawerBody>
                    <NavSectionHeader key={'viewHeader'}>Ansicht</NavSectionHeader>
                    {viewNavItems}
                </NavDrawerBody>
                <NavDivider />
                <NavDrawerFooter style={{ backgroundColor: tokens.colorTransparentBackground }}>
                    <NavItem value="username" className={styles.noHover} disabled>
                        <Stack style={{ alignItems: 'center' }}>
                            <Avatar name={username} size={24} />
                            {username}
                        </Stack>
                    </NavItem>
                    <NavItem icon={<SignOut color={tokens.colorStatusDangerForeground1} />} value="20" className={styles.warningButton}>
                        Logout
                    </NavItem>
                </NavDrawerFooter>
            </NavDrawer>
        </div>
    );
});

export default Navigator;
