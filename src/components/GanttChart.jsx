import React from 'react';
import Moment from 'moment';
import TaskPopup from './TaskPopup.jsx';
// Table components
import TableRow from './table-components/TableRow.jsx';
import TaskTitleTd from './table-components/TaskTitleTd.jsx';
import TaskDraggableTd from './table-components/TaskDraggableTd.jsx';
import TaskNotDraggableTd from './table-components/TaskNotDraggableTd.jsx';
import TaskPlainTd from './table-components/TaskPlainTd.jsx';
// Datepicker
import DatePicker from 'material-ui/DatePicker';

const generateId = function () {
    return Math.random().toString(36).substring(11)
};
const id1 = generateId();
const id2 = generateId();
const id3 = generateId();
const id4 = generateId();
const id5 = generateId();
// Dummy task data
let taskList = {};
taskList[id1] = {
    _id: id1,
    title: "Task One",
    startDate: Moment().add(1, 'd').startOf('day').unix(),
    endDate: Moment().add(5, 'days').startOf('day').unix()
};
taskList[id2] = {
    _id: id2,
    title: "Task Two",
    startDate: Moment().add(2, 'd').startOf('day').unix(),
    endDate: Moment().add(4, 'days').startOf('day').unix()
};
taskList[id3] = {
    _id: id3,
    title: "Task Three",
    startDate: Moment().add(3, 'd').startOf('day').unix(),
    endDate: Moment().add(6, 'days').startOf('day').unix()
};
taskList[id4] = {
    _id: id4,
    title: "Task Four",
    startDate: Moment().add(1, 'd').startOf('day').unix(),
    endDate: Moment().add(2, 'days').startOf('day').unix()
};
taskList[id5] = {
    _id: id5,
    title: "Task five",
    startDate: Moment().add(4, 'd').startOf('day').unix(),
    endDate: Moment().add(10, 'days').startOf('day').unix()
};

let GanttChart = React.createClass({
    getInitialState() {
        return {
            taskList: taskList,
            timeRange: [],
            searchText: "",
            searchSelect: "",
            newTaskInput: "",
            popupShow: false,
            popupTask: null
        };
    },
    componentWillMount() {
        // Set time range array to state
        const taskDates = this.getStartAndEndDateForTasks();
        this.setState({taskDates: taskDates});
        this.setState({timeRange: this.generateTimeRange(Moment.unix(taskDates[0]), Moment.unix(taskDates[1]))});
    },
    getStartAndEndDateForTasks() {
        let startDates = [];
        let endDates = [];
        let taskList = Object.values(this.state.taskList);
        for (let task of taskList) {
            startDates.push(task.startDate);
            endDates.push(task.endDate);
        }

        // Filter arrays to have unique values
        let uniqueStartDates = [...new Set(startDates)];
        let uniqueEndDates = [...new Set(endDates)];

        // Get first date and last one for time range
        let taskDates = [];
        taskDates.push(Math.min.apply(Math, uniqueStartDates));
        taskDates.push(Math.max.apply(Math, uniqueEndDates));

        return taskDates;
    },
    onSearchChange(e) {
        this.setState({searchText: e.target.value});
    },
    onChangeNewTaskInput(e) {
        this.setState({newTaskInput: e.target.value});
    },
    // Button new task
    onClickNewTask() {
        const taskId = generateId();
        let tasks = this.state.taskList;
        tasks[taskId] =
            {
                _id: taskId,
                title: "Task " + Math.random().toString(12).substring(7),
                startDate: Moment().add(Math.floor(Math.random() * 3) + 1, 'days').startOf('day').unix(),
                endDate: Moment().add(Math.floor(Math.random() * 6) + 3, 'days').startOf('day').unix()
            }
        ;

        this.setState({taskList: tasks});
    },
    // Select display type, chart or list
    onSelectDisplayType() {
    },
    // Helper function to generate time range between two Moment objects, returns array of timestamps
    generateTimeRange(momentStartDate, momentEndDate, result = []) {
        if (momentStartDate.isBefore(momentEndDate)) {
            result.push(momentStartDate.unix());
            momentStartDate.add(1, 'day');
            return this.generateTimeRange(momentStartDate, momentEndDate, result);
        } else {
            result.push(momentEndDate.unix());
            return result;
        }
    },
    // Render popup with task details
    renderTaskPopup(e) {
        const tableCellTaskId = e.target.id.split('-')[1];
        let {taskList} = this.state;
        this.setState({popupTask: taskList[tableCellTaskId]});
        this.setState({popupShow: true});
    },
    closeTaskPopup() {
        this.setState({popupShow: false});
        this.setState({popupTask: null});
    },
    // Update task data to state and pass data to callback if callback exists
    saveTaskData(taskObject) {
        // Update gantt chart state
        let taskList = this.state.taskList;
        taskList[taskObject._id] = taskObject;
        this.setState({taskList});
        // Pass data to callback
        if (this.props.onSaveTaskCb) {
            this.props.onSaveTaskCb(taskObject);
        }
    },
    // On change date picker for time range chart generator
    onChangeDatePicker(dueDate, e, newData) {
        if (dueDate === 'startDateRenderInput') {
            if (Moment(newData).startOf('day').unix() < this.state.taskDates[1]) {
                let {taskDates} = this.state;
                taskDates[0] = Moment(newData).startOf('day').unix();
                this.setState({taskDates: taskDates});
                this.setState({
                    timeRange: this.generateTimeRange(Moment.unix(taskDates[0]).startOf('day'),
                        Moment.unix(taskDates[1]).startOf('day'))
                });
            } else {
                alert('Start task due date must be lower then end due date!');
            }
        }

        if (dueDate === 'endDateRenderInput') {
            if (Moment(newData).startOf('day').unix() > this.state.taskDates[0]) {
                let {taskDates} = this.state;
                taskDates[1] = Moment(newData).startOf('day').unix();
                this.setState({taskDates: taskDates});
                this.setState({
                    timeRange: this.generateTimeRange(Moment.unix(taskDates[0]).startOf('day'),
                        Moment.unix(taskDates[1]).startOf('day'))
                });
            } else {
                alert('End task due date must be higher then start due date!');
            }
        }
    },
    onClickResetRenderTimeRange() {
        const taskDates = this.getStartAndEndDateForTasks();
        this.setState({timeRange: this.generateTimeRange(Moment.unix(taskDates[0]), Moment.unix(taskDates[1]))});
    },
    /*---------------------- Methods for task dragging - drag/drop events --------------------*/
    columnDragStart(dateValueId, e) {
        const tableCellTaskId = e.target.id.split('-')[1];
        const columnDueDate = parseInt(document.getElementById(dateValueId).value);
        let task = this.state.taskList[tableCellTaskId];

        // Set to state that task is dragged from start date
        if (columnDueDate === task.startDate) {
            this.setState({draggableTaskDate: true});
        }

        // Set to state that task is dragged from end date
        if (columnDueDate === task.endDate) {
            this.setState({draggableTaskDate: false});
        }

        this.setState({draggableTaskId: tableCellTaskId})
    },
    // On drag enter event
    columnDragEnter(e) {
        const tableCellTaskId = e.target.id.split('-')[1];
        if (this.state.draggableTaskId === tableCellTaskId) {
            e.target.classList.add("dragged");
            e.target.style.backgroundColor = "#265A88";
            e.target.style.opacity = .5;
        }
    },
    // On drag leave event
    columnDragLeave(e) {
        const tableCellTaskId = e.target.id.split('-')[1];
        if (this.state.draggableTaskId === tableCellTaskId) {
            e.target.classList.remove("dragged");
            e.target.style.removeProperty("background-color");
            e.target.style.removeProperty("opacity");
            if (e.target.className === "draggable") {
                e.target.style.backgroundColor = "#265A88";
            }
            if (e.target.className === "notDraggable") {
                e.target.style.backgroundColor = "#265A88";
            }
        }
    },
    // On drag over event
    columnDragOver(e) {
        // Needed so drop event can fire
        e.preventDefault();
    },
    // On drop event
    // When due date dropped update task start or end due date
    columnDrop(dateValueId, e) {
        const tableCellTaskId = e.target.id.split('-')[1];
        const columnDueDate = parseInt(document.getElementById(dateValueId).value);
        let task = this.state.taskList[tableCellTaskId];
        if (this.state.draggableTaskId === tableCellTaskId) {
            e.target.style.removeProperty("opacity");
            // Set task start date or end date based on which column is drag date dropped
            if (columnDueDate > task.endDate) {
                task.endDate = columnDueDate;
            }
            if (columnDueDate < task.startDate) {
                task.startDate = columnDueDate;
            }
            if (columnDueDate > task.startDate
                && columnDueDate < task.endDate
                && this.state.draggableTaskDate
            ) {
                task.startDate = columnDueDate;
            } else if (columnDueDate > task.startDate
                && columnDueDate < task.endDate
                && !this.state.draggableTaskDate
            ) {
                task.endDate = columnDueDate;
            }
        }

        this.saveTaskData(task);
        this.state.draggableTaskDate = null;
    },
    /*--------------------------- Methods for generating chart table ------------------*/
    // Generate table header for time range
    renderChartHeaderColumns() {
        let tableThStyle = {
            width: "5%",
            whiteSpace: "nowrap"
        };
        let rows = [<th style={tableThStyle} key="tasksHeaderCell">Tasks</th>];
        let timeRange = this.state.timeRange;
        // Generate table header element foreach date
        timeRange.forEach(function (date, index) {
            rows.push(
                <th style={tableThStyle} key={index}>
                    {Moment.unix(date).format('DD MMM YYYY')}
                </th>
            );
        });

        return rows;
    },
    // Generate task rows with time range
    renderTaskRows() {
        let taskRows = [];
        let timeRange = this.state.timeRange;
        let taskList = Object.values(this.state.taskList);
        // Sort task list by start due date
        /*taskList = taskList.sort(function (a, b) {
         return a.startDate - b.startDate;
         });*/
        // Generate row foreach task
        const tmpRender = function (task) {
            let taskRow = [<TaskTitleTd key={task.title} title={task.title}/>];
            timeRange.forEach(function (date, tdIndex) {
                const tdId = tdIndex + '-' + task._id;
                const dateValueId = task._id + '-' + tdIndex;

                if (date > task.startDate && date < task.endDate) {
                    taskRow.push(
                        <TaskNotDraggableTd className="notDraggable"
                                            key={tdIndex}
                                            keyProp={tdIndex}
                                            id={tdId}
                                            inputId={dateValueId}
                                            date={date}
                                            onClick={this.renderTaskPopup}
                                            onDragLeave={this.columnDragLeave}
                                            onDragEnter={this.columnDragEnter}
                                            onDragOver={this.columnDragOver}
                                            onDrop={this.columnDrop.bind(this, dateValueId)}/>
                    );
                }
                else if (date === task.startDate || date === task.endDate) {
                    taskRow.push(
                        <TaskDraggableTd className="draggable"
                                         key={tdIndex}
                                         keyProp={tdIndex}
                                         id={tdId}
                                         inputId={dateValueId}
                                         date={date}
                                         onClick={this.renderTaskPopup}
                                         onDragStart={this.columnDragStart.bind(this, dateValueId)}
                                         onDragLeave={this.columnDragLeave}
                                         onDragEnter={this.columnDragEnter}
                                         onDragOver={this.columnDragOver}
                                         onDrop={this.columnDrop.bind(this, dateValueId)}/>
                    );
                }
                else {
                    taskRow.push(
                        <TaskPlainTd className="plainTd"
                                     key={tdIndex}
                                     keyProp={tdIndex}
                                     id={tdId}
                                     inputId={dateValueId}
                                     date={date}
                                     onDragLeave={this.columnDragLeave}
                                     onDragEnter={this.columnDragEnter}
                                     onDragOver={this.columnDragOver}
                                     onDrop={this.columnDrop.bind(this, dateValueId)}/>
                    );
                }
            }, this);

            taskRows.push(
                <TableRow key={task._id} keyProp={task._id}>
                    {taskRow}
                </TableRow>
            );
        };

        taskList.forEach(tmpRender.bind(this));

        return taskRows;
    }
    ,
    // Create table structure
    renderChartTable()
    {
        let tableStyle = {
            width: "100%"
        };
        return (
            <table style={tableStyle} className="table table-bordered table-hover table-striped">
                <thead>
                <TableRow key="tasksHeader" keyProp="tasksHeader">
                    {this.renderChartHeaderColumns()}
                </TableRow>
                </thead>
                <tbody>
                {this.renderTaskRows()}
                </tbody>
            </table>
        );
    },
    render()
    {
        let containerStyle = {
            maxWidth: "1100px",
            marginTop: "100px",
            MozBoxShadow: "0 0 30px 5px #999",
            WebkitBoxShadow: "0 0 30px 5px #999",
            padding: 30
        };
        let topRowStyle = {
            marginBottom: 20,
            backgroundColor: "#EEF2F3"
        };
        let paddingStyle = {
            paddingTop: 20
        };
        let tableDivStyle = {
            padding: 0,
            marginTop: "30px",
            overflow: "auto"
        };
        let renderTimeRangeRowStyle = {
            marginTop: 10,
            padding: 10
        };
        let renderTimeRangeDivStyle = {
            marginRight: 10,
        };
        return (
            <div style={containerStyle} className="container">
                <div style={topRowStyle} className="row">
                    <div className="col-sm-6">
                        <h2>My Tasks</h2>
                    </div>
                    <div style={paddingStyle} className="col-sm-3">
                        <input className="form-control"
                               value={this.state.searchText}
                               onChange={this.onSearchChange}/>
                    </div>
                    <div style={paddingStyle} className="col-sm-1">
                        <input type="select"
                               className="form-control"
                               value={this.state.searchSelect}/>
                    </div>
                    <div style={paddingStyle} className="col-sm-2">
                        <button onClick={this.onClickNewTask} className="btn btn-primary">
                            NEW TASK
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="row">
                        <div className="col-sm-4">
                            <input placeholder="New task"
                                   className="form-control"
                                   value={this.state.newTaskInput}
                                   onChange={this.onChangeNewTaskInput}/>
                        </div>
                        <div className="col-sm-4">
                            <p>tasks: in progress, by all</p>
                        </div>
                        <div className="col-sm-2">
                            <p>sort by: custom</p>
                        </div>
                        <div className="col-sm-2">
                            <select onSelect={this.onSelectDisplayType} className="form-control">
                                <option value="GANTT">GANTT</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style={renderTimeRangeRowStyle} className="row">
                    <div style={renderTimeRangeDivStyle} className="col-sm-3">
                        <DatePicker hintText="Start date"
                                    value={new Date(this.state.taskDates[0] * 1000)}
                                    onChange={this.onChangeDatePicker.bind(this, 'startDateRenderInput')}/>
                    </div>
                    <div style={renderTimeRangeDivStyle} className="col-sm-3">
                        <DatePicker hintText="End date"
                                    value={new Date(this.state.taskDates[1] * 1000)}
                                    onChange={this.onChangeDatePicker.bind(this, 'endDateRenderInput')}/>
                    </div>
                    <div style={renderTimeRangeDivStyle} className="col-sm-3">
                        <button style={{marginTop: "5px"}} onClick={this.onClickResetRenderTimeRange}
                                className="btn btn-primary">
                            Reset
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div style={tableDivStyle} className="col-sm-12">
                        {this.renderChartTable()}
                    </div>
                </div>
                <TaskPopup popupTask={this.state.popupTask}
                           popupShow={this.state.popupShow}
                           onClickClose={this.closeTaskPopup}
                           taskFieldsRules={this.props.taskFieldsRules}
                           saveTaskStateCb={this.saveTaskData}/>
            </div>
        );
    }
});

GanttChart.defaultProps = {
    taskFieldsRules: {
        taskOptionalFieldsRules: {
            title: {
                inputType: "text",
                name: "title",
                label: "Task name"
            },
            startDate: {
                inputType: "date",
                name: "start_date",
                label: "Start due date"

            },
            endDate: {
                inputType: "date",
                name: "due_date",
                label: "End due date"
            },
            button1: {
                inputType: "button",
                name: "send_email",
                label: "Send email",
                onClick: (taskData, event) => {
                    //... do something
                }
            }
        },
        taskMandatoryFields: ['_id', 'title', 'startDate', 'endDate', 'button1'],
        taskEditableFields: ['title', 'startDate', 'endDate', 'button1']
    }
};

// Callback prop for task update on task edit/save
GanttChart.propTypes = {
    onSaveTaskCb: React.PropTypes.func
};

export default GanttChart;
