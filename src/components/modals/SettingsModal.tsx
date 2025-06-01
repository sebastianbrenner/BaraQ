import { Caption1, Card, Dialog, DialogBody, DialogSurface, DialogTitle, makeStyles, Switch, Text, Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';
import log from 'loglevel';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useModalStore } from '../../stores/ModalStore';
import { useStore } from '../../stores/Store';
import Stack from '../helper/Stack';

const useStyles = makeStyles({
    drawerPanel: {
        width: '200px',
        backgroundColor: '#f3f2f1',
        padding: '1rem',
    },
    card: {
        width: '100%',
        height: '100%',
        minHeight: '300px',
        maxWidth: '100%',
        paddingTop: '8px',
    },
});

const treeItems = [
    {
        key: 'general',
        label: 'Allgemein',
    }, {
        key: 'notifications',
        label: 'Benachrichtigungen',
    }, {
        key: 'account',
        label: 'Account',
    }
];

const SettingsModal = observer((): JSX.Element => {
    const { showSettingsModal, setModal } = useModalStore();
    const { theme, setTheme } = useStore();
    const [selectedItem, setSelectedItem] = useState<string | null>('general');
    const styles = useStyles();

    const renderCardContent = (): JSX.Element => {
        switch (selectedItem) {
            case 'general':
                return (
                    <Stack style={{ alignItems: 'center' }}>
                        <Text>Theme einstellen</Text>
                        <Switch
                            style={{ marginLeft: 'auto' }}
                            label={theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                            onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); }}
                            checked={theme === 'light'} />
                    </Stack>
                );
            case 'notifications':
                return (
                    <>
                        <Caption1>Notifications</Caption1>
                        <b>Manage how you receive notifications.</b>
                    </>
                );
            case 'account':
                return (
                    <>
                        <Caption1>Account</Caption1>
                        <b>Update account details and preferences.</b>
                    </>
                );
            default:
                return (
                    <>
                        <Caption1>Settings</Caption1>
                        <b>Select a category from the navigation.</b>
                    </>
                );
        }
    };

    const renderTreeItem = (): JSX.Element[] => {
        return treeItems.map((item) =>
        (
            <TreeItem
                itemType="leaf"
                value={item.key}
                onClick={() => { setSelectedItem(item.key) }}
                key={item.key}>
                <TreeItemLayout style={{ paddingLeft: 0, fontWeight: selectedItem === item.key ? 'bold' : 'normal' }}>{item.label}</TreeItemLayout>
            </TreeItem>
        ));
    }

    return (
        <Dialog open={showSettingsModal} onOpenChange={(_, data) => setModal('settings', data.open)} >
            <DialogSurface style={{ paddingLeft: '24px' }}>
                <DialogBody style={{ gridTemplateColumns: 'auto', columnGap: '8px', display: 'flex', width: '100%', height: '100%' }}>
                    <div>
                        <DialogTitle style={{ textOverflow: 'ellipsis' }}>Settings</DialogTitle>
                        <Tree
                            aria-label="Settings Navigation"
                            openItems={[selectedItem ?? '']}
                            onNavigation={(_, data) => { log.debug(data.value); setSelectedItem(data.value as string) }}
                            onCheckedChange={(_, data) => log.debug(data.value)}
                            style={{ paddingTop: '8px' }}
                        >
                            {renderTreeItem()}
                        </Tree>
                    </div>
                    <Card className={styles.card}>{renderCardContent()}</Card>
                </DialogBody>
                {/* <CardFooter>
                    <DialogActions style={{ marginLeft: 'auto', marginTop: '8px' }}>
                        <Button appearance="secondary" onClick={() => setShowSettings(false)}>
                            Cancel
                        </Button>
                        <Button appearance="primary" onClick={() => null}>Save</Button>
                    </DialogActions>
                </CardFooter> */}
            </DialogSurface>
        </Dialog >
    );

});

export default SettingsModal;