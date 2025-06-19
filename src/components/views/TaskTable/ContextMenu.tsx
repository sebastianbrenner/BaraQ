import type {
    PositioningProps
} from '@fluentui/react-components';
import {
    makeStyles,
    Menu,
    MenuItem,
    MenuList, MenuPopover,
    MenuTrigger,
    tokens
} from '@fluentui/react-components';
import {
    bundleIcon,
    DeleteFilled,
    DeleteRegular,
    DocumentArrowRightFilled,
    DocumentArrowRightRegular
} from '@fluentui/react-icons';
import { observer } from 'mobx-react';
import { useTaskTableStore, useTaskStore, useModalStore } from '../../../stores/storeHooks';

const useStyles = makeStyles({
    dangerItem: {
        color: tokens.colorPaletteRedForeground1,

        '& svg': {
            color: tokens.colorPaletteRedForeground1,
        },

        ':hover': {
            backgroundColor: tokens.colorPaletteRedBackground2,
            color: tokens.colorPaletteRedForegroundInverted,

            '& svg': {
                color: tokens.colorPaletteRedForegroundInverted,
            },
        },
    },
});

export const ContextMenu = observer((): JSX.Element | null => {
    const { contextMenuPosition, showContextMenu, setShowContextMenu, contextMenuTask } = useTaskTableStore();
    const { projects, updateTask } = useTaskStore();
    const { setModal } = useModalStore();

    const styles = useStyles();

    const MoveIcon = bundleIcon(DocumentArrowRightFilled, DocumentArrowRightRegular);
    const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

    // Convert mouse position to a virtual element for Popper positioning
    const virtualTarget = contextMenuPosition
        ? ({
            getBoundingClientRect: () =>
            ({
                top: contextMenuPosition.y,
                left: contextMenuPosition.x,
                bottom: contextMenuPosition.y,
                right: contextMenuPosition.x,
                width: 0,
                height: 0,
                x: contextMenuPosition.x,
                y: contextMenuPosition.y,
                toJSON: () => {},
            } as DOMRect),
        } as unknown as HTMLElement)
        : null;

    const positioning: PositioningProps = {
        position: 'below',
        align: 'start',
        target: virtualTarget,
    };

    const handleDeleteTask = (): void => {
        if (!contextMenuTask) return;
        setModal('deleteTask', true);
        setShowContextMenu(false);
    };

    const handleMoveTask = (projectId: string): void => {
        if (!contextMenuTask) return;

        updateTask({ ...contextMenuTask, projectId });
        setShowContextMenu(false);
    };

    if (!contextMenuTask) return null;

    return (
        <Menu open={showContextMenu} onOpenChange={(_, data) => setShowContextMenu(data.open)} positioning={positioning}>
            <MenuTrigger disableButtonEnhancement>
                <div />
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <MenuItem icon={<MoveIcon />}>Verschieben</MenuItem>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                {projects.filter((project) => project.id !== contextMenuTask.projectId).map((project) => (
                                    <MenuItem key={project.id} onClick={() => handleMoveTask(project.id)}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                    <MenuItem
                        icon={<DeleteIcon />}
                        onClick={handleDeleteTask}
                        className={styles.dangerItem}
                    >
                        Löschen
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu >
    );
});
