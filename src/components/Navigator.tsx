import { Avatar, makeStyles, tokens } from '@fluentui/react-components';
import { SignOut20Regular, SignOutFilled, TabGroup20Filled, TabGroup20Regular, bundleIcon } from '@fluentui/react-icons';
import { AppItem, NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, type OnNavItemSelectData } from '@fluentui/react-nav-preview';
import { observer } from 'mobx-react';
import { useEffect, useRef, type JSX, type SyntheticEvent } from 'react';
import logo from '../assets/logo.png';
import { useCredentialStore } from '../stores/CredentialStore';
import { useNavigationStore } from '../stores/NavigationStore';
import { useTaskStore } from '../stores/TaskStore';
import Stack from './helper/Stack';

const useStyles = makeStyles({
    root: {
        overflow: 'hidden',
        display: 'flex',
    },
    nav: {
        minWidth: '200px',
    },
    field: {
        display: 'flex',
        marginTop: '4px',
        marginLeft: '8px',
        flexDirection: 'column',
        gridRowGap: tokens.spacingVerticalS,
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

const SignOut = bundleIcon(SignOutFilled, SignOut20Regular);
const TabGroup = bundleIcon(TabGroup20Filled, TabGroup20Regular);

const Navigator = observer((): JSX.Element => {
    const { username } = useCredentialStore();
    const { isDrawerOpen, setIsDrawerOpen } = useNavigationStore();
    const taskStore = useTaskStore();
    const { projects, selectedProject, setSelectedProject } = taskStore;
    const styles = useStyles();

    const drawerRef = useRef<HTMLDivElement>(null);

    const projectNavItems = projects.map((project, index) => (
        <NavItem icon={<TabGroup />} key={index} value={project}>
            {project}
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
        setIsDrawerOpen(false);
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
                    <NavSectionHeader>Project</NavSectionHeader>
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
