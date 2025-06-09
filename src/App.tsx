import { Button, CompoundButton, FluentProvider, makeStyles, Tooltip, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { Add28Filled, EyeOffRegular, EyeRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react';
import Header from './components/Header';
import Stack from './components/helper/Stack';
import Login from './components/Login';
import DeleteTaskModal from './components/modals/DeleteTaskModal';
import EditProjectModal from './components/modals/EditProjectModal';
import NewProjectModal from './components/modals/NewProjectModal';
import NewTaskModal from './components/modals/NewTaskModal';
import SettingsModal from './components/modals/SettingsModal';
import Navigator from './components/Navigator';
import TaskTable from './components/TaskTable/TaskTable';
import { useCredentialStore } from './stores/CredentialStore';
import { useModalStore } from './stores/ModalStore';
import { useStore } from './stores/Store';
import { useTaskTableStore } from './stores/TaskTableStore';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100dvw',
        height: '100dvh',
    },
    form: {
        // Stack the label above the field (with 2px gap per the design system)
        '> div': { display: 'flex', flexDirection: 'column', gap: '2px' },
    },
    content: {
        height: '100%',
        overflowY: 'scroll',
        padding: '8px',
    },
    button: {
        width: '100px',
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
});

const App = observer((): JSX.Element => {
    const credentialStore = useCredentialStore();
    const { setModal } = useModalStore();
    const { showCompletedTasks, setShowCompletedTasks } = useTaskTableStore();
    const { theme } = useStore();
    const styles = useStyles();

    const content: JSX.Element = !credentialStore.username ? (
        <Login />
    ) : (
        <div style={{ height: '100%' }}>
            <Navigator />
            <TaskTable />
        </div>
    );

    const onClickNewTaskButton = (): void => {
        setModal('newTask', true);
    }

    const onClickShowCompletedTask = (): void => {
        setShowCompletedTasks(!showCompletedTasks);
    }

    return (
        <FluentProvider theme={theme === 'light' ? webLightTheme : webDarkTheme}>
            <div className={styles.root}>
                <Header />
                <SettingsModal />
                <NewTaskModal />
                <DeleteTaskModal />
                <NewProjectModal />
                <EditProjectModal />
                <div className={styles.content}>{content}</div>
            </div>
            <Stack
                direction='column'
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 1000,
                    alignItems: 'center',
                }}
            >
                <Tooltip content="Zeige erledigte Aufgaben" relationship="label">
                    <Button
                        shape="circular"
                        appearance="transparent"
                        icon={showCompletedTasks ? <EyeRegular /> : <EyeOffRegular />}
                        aria-label="Zeige erledigte Aufgaben"
                        onClick={onClickShowCompletedTask}
                        className={styles.button}
                    />
                </Tooltip>
                <Tooltip content="Aufgabe hinzufügen" relationship="label">
                    <CompoundButton
                        shape="circular"
                        appearance="primary"
                        icon={<Add28Filled />}
                        aria-label="Aufgabe hinzufügen"
                        onClick={onClickNewTaskButton}
                        className={styles.button}
                    />
                </Tooltip>
            </Stack>
        </FluentProvider>
    );
});

export default App;
