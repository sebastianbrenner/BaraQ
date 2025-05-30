import { makeStyles } from '@fluentui/react-components';
import { observer } from 'mobx-react';
import Header from './components/Header';
import Login from './components/Login';
import Navigator from './components/Navigator';
import TaskTable from './components/TaskTable/TaskTable';
import { useCredentialStore } from './stores/CredentialStore';

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
    const styles = useStyles();

    const content: JSX.Element = !credentialStore.username ? (
        <Login />
    ) : (
        <div style={{ height: '100%' }}>
            <Navigator />
            <TaskTable />
        </div>
    );

    return (
        <div className={styles.root}>
            <Header />
            <div className={styles.content}>{content}</div>
        </div>
    );
});

export default App;
