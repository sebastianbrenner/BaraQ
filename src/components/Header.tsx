import { Button, makeStyles, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton, Text, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, useRestoreFocusTarget, type MenuButtonProps } from '@fluentui/react-components';
import { Edit20Regular, NavigationFilled, Settings20Regular, SquareAddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react';
import { useModalStore } from '../stores/ModalStore';
import { useNavigationStore } from '../stores/NavigationStore';
import { useTaskStore } from '../stores/TaskStore';

const useStyles = makeStyles({
    header: {
        padding: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        minWidth: '200px',
    },
    toolbar: {
        gap: '4px',
    },
    button: {
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        marginLeft: '8px',
    },
    projectWidth: {
        minWidth: '120px',
    }
});

const Header = observer((): JSX.Element => {
    const { setModal } = useModalStore();
    const styles = useStyles();
    const { setIsDrawerOpen, setEditProjectId } = useNavigationStore();
    const { selectedProject, projects, setSelectedProject } = useTaskStore();

    // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
    const restoreFocusTargetAttributes = useRestoreFocusTarget();

    const onClickToolbarButton = (): void => {
        setIsDrawerOpen(true);
    };

    const onClickSettings = (): void => {
        setModal('settings', true);
    };

    const handleSelectProject = (projectId: string): void => {
        if (!projectId) return;
        setSelectedProject(projectId);
    };

    const handleEditProject = (projectId: string): void => {
        if (!projectId) return;
        setEditProjectId(projectId);
        setModal('editProject', true);
    }

    const handleClickNewProject = (): void => {
        setModal('newProject', true);
    }

    return (
        <div className={styles.header}>
            <Toolbar className={styles.toolbar}>
                <ToolbarButton icon={<NavigationFilled />} onClick={onClickToolbarButton} {...restoreFocusTargetAttributes} />
                <ToolbarDivider />
                <Menu positioning='below-end'>
                    <MenuTrigger disableButtonEnhancement>
                        {(triggerProps: MenuButtonProps) => (
                            <SplitButton
                                menuButton={{
                                    ...triggerProps,
                                    onClick: (e: React.MouseEvent<HTMLElement>) => {
                                        e.stopPropagation();
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (triggerProps.onClick as any)?.(e);
                                    },
                                }}
                                icon={<Edit20Regular aria-label="Bearbeiten" />}
                                onClick={() => handleEditProject(selectedProject.id)}
                            >
                                <Text className={styles.projectWidth}>{selectedProject.name}</Text>
                            </SplitButton>
                        )}
                    </MenuTrigger>
                    <MenuPopover style={{ minWidth: '196px' }}>
                        <MenuList>
                            {projects.map((project) => (
                                <MenuItem key={project.id} onClick={() => handleSelectProject(project.id)}>{project.name}</MenuItem>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Tooltip content="Projekt hinzufügen" relationship="label">
                    <Button
                        shape="circular"
                        appearance="primary"
                        icon={<SquareAddRegular />}
                        aria-label="Projekt hinzufügen"
                        onClick={handleClickNewProject}
                        className={styles.button}
                    />
                </Tooltip>
                <ToolbarDivider style={{ marginLeft: 'auto' }} />
                <ToolbarButton onClick={onClickSettings} icon={<Settings20Regular />} />
            </Toolbar>
        </div>
    );
});

export default Header;
