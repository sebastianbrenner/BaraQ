import { List, ListItem, makeStyles, SearchBox, Tab, TabList, type InputOnChangeData, type SearchBoxChangeEvent, type SelectionItemId, type SelectTabData, type SelectTabEvent } from '@fluentui/react-components';
import React, { useState } from 'react';
import { useTaskStore } from '../stores/storeHooks';

const useStyles = makeStyles({
    list: {
        height: '200px',
        overflowY: 'scroll',
    },
});

type TaskSearchProps = {
    projectId: string;
    onChangeReferences: (references: { predecessorIds: string[], successorIds: string[] }) => void
}

const ReferenceEditor = ({ projectId, onChangeReferences }: TaskSearchProps): JSX.Element => {
    const { tasks } = useTaskStore();
    const [searchTerm, setSearchTerm] = useState<string>('');

    const selectedProjectTasks = tasks.filter((task) => task.projectId === projectId);
    const filteredTasks = selectedProjectTasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const [selectedSuccessorIds, setSelectedSuccessorIds] = React.useState<string[]>([]);
    const [selectedPredescessorIds, setSelectedPredescessorIds] = React.useState<string[]>([]);

    const styles = useStyles();

    const handleOnChange = (event: SearchBoxChangeEvent, data: InputOnChangeData): void => {
        setSearchTerm(data.value);
    }


    const [selectedTab, setSelectedTab] = useState('predecessorIds');
    const handleTabSelect = (_: SelectTabEvent, data: SelectTabData): void => {
        setSelectedTab(data.value as string);
    }

    const handleSelectionChange = (_: React.SyntheticEvent | Event, data: { selectedItems: SelectionItemId[] }): void => {
        const selectedItems = Array.from(data.selectedItems) as string[];

        if (selectedTab === 'predecessorIds') {
            setSelectedPredescessorIds(selectedItems);
            onChangeReferences({ predecessorIds: selectedItems, successorIds: selectedSuccessorIds });
        } else {
            setSelectedSuccessorIds(selectedItems);
            onChangeReferences({ predecessorIds: selectedPredescessorIds, successorIds: selectedItems });
        }
    }

    const selectedItems = selectedTab === 'predecessorIds' ? selectedPredescessorIds : selectedSuccessorIds;

    return (
        <>
            <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
                <Tab value="predecessorIds">Vorgängeraufgabe</Tab>
                <Tab value="successorIds">Nachfolgeraufgabe</Tab>
            </TabList>
            <SearchBox onChange={handleOnChange} />
            <List
                selectionMode="multiselect"
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                className={styles.list}
            >
                {filteredTasks.map(({ id, title }) => (
                    <ListItem
                        key={id}
                        value={id}
                    >
                        {title}
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default ReferenceEditor