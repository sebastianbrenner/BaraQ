import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalenderViewStyle.css';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { observer } from 'mobx-react';
import type { JSX } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import { useCalendarStore, useModalStore, useSettingsStore, useTaskStore } from '../../../stores/storeHooks';

const locales = {
    de,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const CalendarView = observer((): JSX.Element => {
    const { selectedProjectTasks, getTaskById } = useTaskStore();
    const { setSelectedTask } = useCalendarStore();
    const { showCompletedTasks } = useSettingsStore();
    const { setModal } = useModalStore();

    const events = selectedProjectTasks.filter(task => showCompletedTasks || !task.done).map(task => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.title,
        id: task.id,
        done: task.done,
    }));

    const handleSelectEvent = (
        event: {
            start: Date;
            end: Date;
            title: string;
            id: string;
        }): void => {
        setSelectedTask(getTaskById(event.id)!);
        setModal('editTask', true);
    }

    return (
        <>
            <Calendar
                localizer={localizer}
                culture='de'
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView='month'
                views={['month', 'week']}
                allDayAccessor={() => true} // force all events to be all-day
                min={new Date(0, 0, 1, 0, 0)}
                max={new Date(0, 0, 1, 0, 0)} // same as min = no hour grid
                dayLayoutAlgorithm={'no-overlap'}
                style={{ height: '100%' }}
                popup
                onSelectEvent={handleSelectEvent}
                messages={{
                    date: 'Datum',
                    time: 'Zeit',
                    event: 'Event',
                    allDay: 'Ganztägig',
                    month: 'Monat',
                    week: 'Woche',
                    previous: 'Zurück',
                    next: 'Weiter',
                    today: 'Heute',
                    noEventsInRange: 'Keine Aufgaben in diesem Zeitraum.',
                    showMore: total => `+${total} mehr`,
                }}
            />
        </>
    )
});

export default CalendarView