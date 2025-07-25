import { Button, CompoundButton, FluentProvider, makeStyles, Tooltip, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { Add28Filled, EyeOffRegular, EyeRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react';

import Header from './components/Header';
import Stack from './components/helper/Stack';
import Login from './components/Login';
import Navigator from './components/Navigator';
import { type Modal, modalComponents } from './stores/ModalStore';
import { useStore } from './stores/Store';
import { useCredentialStore, useModalStore, useSettingsStore, useViewStore } from './stores/storeHooks';
import { views } from './stores/ViewStore';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100dvw',
        height: '100dvh',
    },
    form: {
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
    const { selectedView } = useViewStore();
    const { modals, setModal } = useModalStore();
    const { showCompletedTasks, setShowCompletedTasks } = useSettingsStore();
    const { theme } = useStore();
    const styles = useStyles();

    const view = views.find((view) => view.viewKey === selectedView)?.component;
    if (!view) throw new Error(`View '${selectedView}' not found`);

    const content: JSX.Element = !credentialStore.username ? (
        <Login />
    ) : (
        <div style={{ height: '100%' }}>
            <Navigator />
            {view}
        </div>
    );

    const onClickNewTaskButton = (): void => {
        setModal('newTask', true);
    }

    const onClickShowCompletedTask = (): void => {
        setShowCompletedTasks(!showCompletedTasks);
    }

    const openModal = Object.entries(modals).map(([modalKey, isOpen]) => {
        if (!isOpen) return null;
        const ModalComponent = modalComponents[modalKey as Modal];
        return <ModalComponent key={modalKey} />;
    })

    return (
        <FluentProvider theme={theme === 'light' ? webLightTheme : webDarkTheme}>
            <div className={styles.root}>
                <Header />
                {openModal}
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
