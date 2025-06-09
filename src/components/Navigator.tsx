import {
    Avatar,
    makeStyles,
    Text,
    tokens,
    Tooltip
} from '@fluentui/react-components';
import {
    AddCircle20Regular, AddCircleFilled, bundleIcon, Edit20Regular,
    SignOut20Regular, SignOutFilled, TabGroup20Filled, TabGroup20Regular
} from '@fluentui/react-icons';
import {
    NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, type OnNavItemSelectData
} from '@fluentui/react-nav-preview';
import { observer } from 'mobx-react';
import { useEffect, useRef, type JSX, type SyntheticEvent } from 'react';
import logo from '../assets/logo.png';
import { useCredentialStore } from '../stores/CredentialStore';
import { useModalStore } from '../stores/ModalStore';
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

const Navigator = observer((): JSX.Element => {
    const { username } = useCredentialStore();
    const { setModal } = useModalStore();
    const { isDrawerOpen, setIsDrawerOpen, setEditProjectId } = useNavigationStore();
    const taskStore = useTaskStore();
    const { projects, selectedProject, setSelectedProject } = taskStore;
    const styles = useStyles();

    const drawerRef = useRef<HTMLDivElement>(null);

    const onClickEdit = (projectId: string): void => {
        setIsDrawerOpen(false);
        setEditProjectId(projectId);
        setModal('editProject', true);
    };

    const projectNavItems = projects.map((project, index) => (
        <NavItem icon={<TabGroup />} key={index} value={project.id}>
            {project.name}
            <div style={{ marginLeft: 'auto' }}>
                <Tooltip content="Bearbeiten" relationship="label">
                    <Edit20Regular
                        aria-label="Bearbeiten"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent NavItem click
                            onClickEdit(project.id);
                        }}
                    />
                </Tooltip>
            </div>
        </NavItem>
    ));

    const onClickNewProject = (): void => {
        setModal('newProject', true);
    }

    projectNavItems.push(
        <NavDivider key={'divider'} />,
        <NavItem icon={<AddGroup />} key={'add'} value={'new'} onClick={onClickNewProject}>
            Neues Project
        </NavItem>
    );

    /* projectNavItems.push(
        <NavDivider key={'divider'} />,
        <Select value={selectedProject.id} onChange={onSelectProject}>
            <option value={'test'}>test</option>
            <option value={'test'}>test</option>
            <option value={'test'}>test</option>
            <option value={'test'}>test</option>
        </Select>
    ); */

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
        setSelectedProject(data.value);
    };

    return (
        <div className={styles.root}>
            <NavDrawer
                onNavItemSelect={onNavItemSelect}
                selectedValue={selectedProject.id}
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
                    <NavSectionHeader key={'projectHeader'}>Projekt</NavSectionHeader>
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
