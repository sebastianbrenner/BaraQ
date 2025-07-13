import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Dropdown, Input, Label, makeStyles, Option, type OptionOnSelectData, type SelectionEvents, Text, Textarea } from '@fluentui/react-components';
import log from 'loglevel';
import { observer } from 'mobx-react';
import { useState } from 'react';

import { useCalendarStore, useModalStore, useTaskStore } from '../../stores/storeHooks';
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

const end = 10;

const EditTaskModal = observer((): JSX.Element => {
    const { modals: { editTask }, setModal } = useModalStore();
    const { updateTask, projects, selectedProject } = useTaskStore();
    const { selectedTask } = useCalendarStore();
    const styles = useStyles();

    if (!selectedTask) return <></>;

    const [done, setDone] = useState(selectedTask.done);
    const [projectId, setProjectId] = useState(selectedProject.id);
    const [title, setTitle] = useState(selectedTask.title);
    const [description, setDescription] = useState(selectedTask.description);
    const [priority, setPriority] = useState<string>(selectedTask.priority);
    const [dueDate, setDueDate] = useState<string>(selectedTask.dueDate.toISOString().substring(0, end));
    const [predecessorIds, setPredecessorIds] = useState<string[]>(selectedTask.predecessorIds);
    const [successorIds, setSuccessorIds] = useState<string[]>(selectedTask.predecessorIds);

    const onEditTask = (): void => {
        log.debug('onEditTask', projectId, title, description, priority, dueDate);
        updateTask({
            id: selectedTask.id,
            title,
            description,
            done,
            priority: priority as Priority,
            dueDate: new Date(dueDate),
            projectId,
            createdAt: new Date(),
            predecessorIds,
            successorIds,
        })
        setModal('editTask', false);
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
        <Dialog open={editTask} onOpenChange={(_, data) => setModal('editTask', data.open)} >
            <DialogSurface>
                <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <DialogTitle>
                        Aufgabe bearbeiten
                    </DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                            <Stack style={{ alignItems: 'center' }}>
                                <Checkbox
                                    checked={done}
                                    onChange={(ev, data) => setDone(data.checked as boolean)}
                                />
                                <Text>Erledigt</Text>
                            </Stack>
                            <div className={styles.input}>
                                <Label htmlFor={'title'}>
                                    Titel
                                </Label>
                                <Input id={'title'} required value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className={styles.input}>
                                <Label htmlFor={'projectDropdown'}>
                                    Projekt
                                </Label>
                                <Dropdown id={'projectDropdown'} name="project" value={projects.find(item => item.id === projectId)!.name} style={{ flex: 1 }} onOptionSelect={onChangeProject}>
                                    {projects.map((project) => (
                                        <Option key={project.id} value={project.id}>{project.name}</Option>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className={styles.input}>
                                <Label htmlFor={'description'}>
                                    Beschreibung
                                </Label>
                                <Textarea id={'description'} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className={styles.input}>
                                    <Label htmlFor={'priority'}>
                                        Priorität
                                    </Label>
                                    <Dropdown id={'priority'} value={priority} onOptionSelect={(_, data) => setPriority(data.optionValue ?? 'Niedrig')}>
                                        {PRIORITIES.map((priority) => (
                                            <Option key={priority} value={priority}>{priority}</Option>
                                        ))}
                                    </Dropdown>
                                </div>
                                <div className={styles.input}>
                                    <Label htmlFor={'dueDate'}>
                                        Fälligkeitsdatum
                                    </Label>
                                    <Input type="date" id={'dueDate'} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                                </div>
                            </div>
                            <ReferenceEditor projectId={projectId} onChangeReferences={onChangeReferences} successorIds={successorIds} predecessorIds={predecessorIds} />
                        </div>
                    </DialogContent>
                    <DialogActions style={{ alignSelf: 'flex-end' }}>
                        <Button appearance="secondary">Abbrechen</Button>
                        <Button appearance="primary" onClick={onEditTask}>Aktualisieren</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog >
    );

});

export default EditTaskModal;