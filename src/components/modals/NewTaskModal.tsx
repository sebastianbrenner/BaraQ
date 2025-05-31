import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Dropdown, Input, Label, makeStyles, Option, Textarea, type OptionOnSelectData, type SelectionEvents } from '@fluentui/react-components';
import log from 'loglevel';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useModalStore } from '../../stores/ModalStore';
import { useTaskStore } from '../../stores/TaskStore';
import { PRIORITIES, type Priority } from '../../types';
import Stack from '../helper/Stack';

const useStyles = makeStyles({
    input: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: 1
    },
});


const NewTaskModal = observer((): JSX.Element => {
    const { showNewTaskModal, setModal } = useModalStore();
    const { addTask, projects, selectedProject } = useTaskStore();
    const styles = useStyles();

    const [project, setDefaultProject] = useState(selectedProject);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<string>(PRIORITIES[0]);
    const [dueDate, setDueDate] = useState<string>('');

    const onAddNewTask = (): void => {
        log.debug('onAddNewTask', project, title, description, priority, dueDate);
        addTask({
            id: crypto.randomUUID(),
            title,
            description,
            done: false,
            priority: priority as Priority,
            dueDate: new Date(dueDate),
            project,
        })
        setModal('newTask', false);
    }

    const onChangeProject = (_: SelectionEvents, data: OptionOnSelectData): void => {
        if (!data.optionValue) return;
        setDefaultProject(data.optionValue);
    }

    return (
        <Dialog open={showNewTaskModal} onOpenChange={(_, data) => setModal('newTask', data.open)} >
            <DialogSurface>
                <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <DialogTitle>
                        <Stack>
                            Neue Aufgabe für
                            <Dropdown id={'projectDropdown'} name="project" value={project} style={{ flex: 1 }} onOptionSelect={onChangeProject}>
                                {projects.map((option) => (
                                    <Option key={option} value={option}>{option}</Option>
                                ))}
                            </Dropdown>
                            erstellen
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                            <div className={styles.input}>
                                <Label htmlFor={'title'}>
                                    Titel
                                </Label>
                                <Input id={'title'} required onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className={styles.input}>
                                <Label htmlFor={'description'}>
                                    Beschreibung
                                </Label>
                                <Textarea id={'description'} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className={styles.input}>
                                    <Label htmlFor={'priority'}>
                                        Priorität
                                    </Label>
                                    <Dropdown id={'priority'} value={priority} onOptionSelect={(_, data) => setPriority(data.optionValue || 'Low')}>
                                        {PRIORITIES.map((priority) => (
                                            <Option key={priority} value={priority}>{priority}</Option>
                                        ))}
                                    </Dropdown>
                                </div>
                                <div className={styles.input}>
                                    <Label htmlFor={'dueDate'}>
                                        Fälligkeitsdatum
                                    </Label>
                                    <Input type="date" id={'dueDate'} onChange={(e) => setDueDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{ alignSelf: 'flex-end' }}>
                        <Button appearance="secondary">Cancel</Button>
                        <Button appearance="primary" onClick={onAddNewTask}>Create Task</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog >
    );

});

export default NewTaskModal;