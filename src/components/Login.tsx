import { Button, Input, Label, makeStyles, useId } from '@fluentui/react-components';
import { useRef } from 'react';
import { useCredentialStore } from '../stores/CredentialStore';
import Stack from './helper/Stack';

const useStyles = makeStyles({
    form: {
        // Stack the label above the field (with 2px gap per the design system)
        '> div': { display: 'flex', flexDirection: 'column', gap: '2px' },
    },
});

const Login = (): JSX.Element => {
    const credentialStore = useCredentialStore();
    const styles = useStyles();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameId = useId('input-username');
    const passwordId = useId('input-password');

    const onClickLogin = (): void => {
        if (!usernameRef.current) return;
        credentialStore.setUsername(usernameRef.current.value);
    };

    return (
        <form noValidate autoComplete="off" className={styles.form}>
            <Stack direction="column">
                <Stack direction="column" gap={0}>
                    <Label htmlFor={usernameId}>Username</Label>
                    <Input type="text" id={usernameId} ref={usernameRef} />
                </Stack>
                <Stack direction="column" gap={0}>
                    <Label htmlFor={passwordId}>Password</Label>
                    <Input type="password" id={passwordId} ref={passwordRef} />
                </Stack>
                <Button appearance="primary" onClick={onClickLogin}>
                    Login
                </Button>
            </Stack>
        </form>
    );
};

export default Login;
