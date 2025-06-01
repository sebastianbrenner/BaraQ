import { makeStyles, Text, Toolbar, ToolbarButton, ToolbarDivider, useRestoreFocusTarget } from '@fluentui/react-components';
import { NavigationFilled, Settings20Regular } from '@fluentui/react-icons';
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
    },
    toolbar: {
        paddingLeft: 0,
    },
});

const Header = observer((): JSX.Element => {
    const { setModal } = useModalStore();
    const styles = useStyles();
    const { setIsDrawerOpen } = useNavigationStore();
    const { selectedProject } = useTaskStore();

    // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
    const restoreFocusTargetAttributes = useRestoreFocusTarget();

    const onClickToolbarButton = (): void => {
        setIsDrawerOpen(true);
    };

    const onClickSettings = (): void => {
        setModal('settings', true);
    };

    return (
        <div className={styles.header}>
            <Toolbar className={styles.toolbar}>
                <ToolbarButton icon={<NavigationFilled />} onClick={onClickToolbarButton} {...restoreFocusTargetAttributes} />
                <ToolbarDivider />
                <Text className={styles.title}>{selectedProject.name}</Text>

                <ToolbarDivider style={{ marginLeft: 'auto' }} />
                <ToolbarButton onClick={onClickSettings} icon={<Settings20Regular />} />
            </Toolbar>
        </div>
    );
});

export default Header;
