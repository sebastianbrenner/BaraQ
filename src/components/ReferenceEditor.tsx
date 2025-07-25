import { type InputOnChangeData, List, ListItem, makeStyles, SearchBox, type SearchBoxChangeEvent, type SelectionItemId, type SelectTabData, type SelectTabEvent, Tab, TabList } from '@fluentui/react-components';
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
    onChangeReferences: (references: { predecessorIds: string[], successorIds: string[] }) => void;
    successorIds?: string[];
    predecessorIds?: string[];
}

const ReferenceEditor = ({ onChangeReferences, predecessorIds, successorIds }: TaskSearchProps): JSX.Element => {
    const { selectedProjectTasks } = useTaskStore();
    const [searchTerm, setSearchTerm] = useState<string>('');

    //const selectedProjectTasks = tasks.filter((task) => task.projectId === projectId);
    const filteredTasks = selectedProjectTasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const [selectedSuccessorIds, setSelectedSuccessorIds] = React.useState<string[]>(successorIds ?? []);
    const [selectedPredescessorIds, setSelectedPredescessorIds] = React.useState<string[]>(predecessorIds ?? []);

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