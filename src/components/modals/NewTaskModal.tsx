import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Dropdown, Input, Label, makeStyles, Option, type OptionOnSelectData, type SelectionEvents, Textarea } from '@fluentui/react-components';
import log from 'loglevel';
import { observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { useModalStore, useTaskStore } from '../../stores/storeHooks';
import { PRIORITIES, type Priority } from '../../types/types';
import Stack from '../helper/Stack';
import ReferenceEditor from '../ReferenceEditor';

const useStyles = makeStyles({
    input: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: 1
    },
});


const NewTaskModal = observer((): JSX.Element => {
    const { modals: { newTask }, setModal } = useModalStore();
    const { addTask, projects, selectedProject } = useTaskStore();
    const styles = useStyles();

    const [projectId, setProjectId] = useState(selectedProject.id);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<string>(PRIORITIES[0]);
    const [dueDate, setDueDate] = useState<string>('');
    const [predecessorIds, setPredecessorIds] = useState<string[]>([]);
    const [successorIds, setSuccessorIds] = useState<string[]>([]);

    const onAddNewTask = (): void => {
        log.debug('onAddNewTask', projectId, title, description, priority, dueDate);
        addTask({
            id: nanoid(),
            title,
            description,
            done: false,
            priority: priority as Priority,
            dueDate: new Date(dueDate),
            projectId,
            createdAt: new Date(),
            predecessorIds,
            successorIds,
        })
        setModal('newTask', false);
    }

    const onChangeProject = (_: SelectionEvents, data: OptionOnSelectData): void => {
        if (!data.optionValue) return;
        setProjectId(data.optionValue);
    }

    const onChangeReferences = (references: { predecessorIds: string[], successorIds: string[] }): void => {
        setPredecessorIds(references.predecessorIds);
        setSuccessorIds(references.successorIds);
    }

    return (
        <Dialog open={newTask} onOpenChange={(_, data) => setModal('newTask', data.open)} >
            <DialogSurface>
                <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <DialogTitle>
                        <Stack>
                            Neue Aufgabe für
                            <Dropdown id={'projectDropdown'} name="project" value={projects.find(item => item.id === projectId)!.name} style={{ flex: 1 }} onOptionSelect={onChangeProject}>
                                {projects.map((project) => (
                                    <Option key={project.id} value={project.id}>{project.name}</Option>
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
                            <ReferenceEditor projectId={projectId} onChangeReferences={onChangeReferences} />
                        </div>
                    </DialogContent>
                    <DialogActions style={{ alignSelf: 'flex-end' }}>
                        <Button appearance="secondary">Abbrechen</Button>
                        <Button appearance="primary" onClick={onAddNewTask}>Erstellen</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog >
    );

});

export default NewTaskModal;