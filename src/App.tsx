import { CompoundButton, FluentProvider, makeStyles, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { Add28Filled } from '@fluentui/react-icons';
import { observer } from 'mobx-react';
import Header from './components/Header';
import Login from './components/Login';
import NewTaskModal from './components/modals/NewTaskModal';
import SettingsModal from './components/modals/SettingsModal';
import Navigator from './components/Navigator';
import TaskTable from './components/TaskTable/TaskTable';
import { useCredentialStore } from './stores/CredentialStore';
import { useModalStore } from './stores/ModalStore';
import { useStore } from './stores/Store';

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
});

const App = observer((): JSX.Element => {
    const credentialStore = useCredentialStore();
    const { setModal } = useModalStore();
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

    return (
        <FluentProvider theme={theme === 'light' ? webLightTheme : webDarkTheme}>
            <div className={styles.root}>
                <Header />
                <SettingsModal />
                <NewTaskModal />
                <div className={styles.content}>{content}</div>
            </div>
            <CompoundButton shape="circular"
                appearance="primary"
                icon={<Add28Filled />}
                aria-label="Add task"
                onClick={onClickNewTaskButton}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    height: '52px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                }}
            />
        </FluentProvider>
    );
});

export default App;
