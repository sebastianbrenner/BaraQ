import {
    Avatar,
    makeStyles, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, tokens
} from '@fluentui/react-components';
import {
    AddCircle20Regular, AddCircleFilled, bundleIcon, MoreHorizontalFilled, MoreHorizontalRegular, SignOut20Regular, SignOutFilled, TabGroup20Filled, TabGroup20Regular
} from '@fluentui/react-icons';
import {
    AppItem, NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, type OnNavItemSelectData
} from '@fluentui/react-nav-preview';
import { observer } from 'mobx-react';
import { useEffect, useRef, type JSX, type SyntheticEvent } from 'react';
import logo from '../assets/logo.png';
import { useCredentialStore } from '../stores/CredentialStore';
import { useNavigationStore } from '../stores/NavigationStore';
import { useTaskStore } from '../stores/TaskStore';
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
const AddGroup = bundleIcon(AddCircleFilled, AddCircle20Regular);
const MenuIcon = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

const Navigator = observer((): JSX.Element => {
    const { username } = useCredentialStore();
    const { isDrawerOpen, setIsDrawerOpen } = useNavigationStore();
    const taskStore = useTaskStore();
    const { projects, selectedProject, setSelectedProject } = taskStore;
    const styles = useStyles();

    const drawerRef = useRef<HTMLDivElement>(null);

    const projectNavItems = projects.map((project, index) => (
        <NavItem icon={<TabGroup />} key={index} value={project} style={{ alignContent: 'center' }}>
            {project}
            <Menu positioning={{ autoSize: true }}>
                <MenuTrigger disableButtonEnhancement>
                    <span style={{ marginLeft: 'auto' }}>
                        <MenuIcon />
                    </span>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem>Umbenennen</MenuItem>
                        <MenuItem className={styles.warningButton}>Löschen</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </NavItem>
    ));

    projectNavItems.push(
        <NavDivider key={'divider'} />,
        <NavItem icon={<AddGroup />} key={'add'} value={'new'}>
            Neues Project
        </NavItem>
    );

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

    // close the drawer when a project is selected
    const onNavItemSelect = (_: Event | SyntheticEvent<Element, Event>, data: OnNavItemSelectData): void => {
        setIsDrawerOpen(false);
        if (data.value === 'new') return;
        setSelectedProject(data.value);
    };

    return (
        <div className={styles.root}>
            <NavDrawer
                onNavItemSelect={onNavItemSelect}
                selectedValue={selectedProject}
                defaultSelectedCategoryValue=""
                open={isDrawerOpen}
                className={styles.nav}
                density="medium"
                ref={drawerRef}
            >
                <NavDrawerHeader>
                    <Stack style={{ alignItems: 'center' }}>
                        <img src={logo} alt="logo" height={24} />
                        <AppItem as="a">BaraQ</AppItem>
                    </Stack>
                </NavDrawerHeader>
                <NavDivider />
                <NavDrawerBody>
                    <NavSectionHeader key={'projectHeader'}>Project</NavSectionHeader>
                    {projectNavItems}
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
