let React = require('react');
let Moment = require('moment');
let TaskPopup = require('./TaskPopup.jsx');

let generateId = function () {
    return Math.random().toString(36).substring(11)
};
// Dummy task data
let taskList = [
    {
        _id: generateId(),
        title: "Task One",
        startDate: Moment().add(1, 'd').unix(),
        endDate: Moment().add(5, 'days').unix()
    },
    {
        _id: generateId(),
        title: "Task two",
        startDate: Moment().add(3, 'days').unix(),
        endDate: Moment().add(4, 'days').unix()
    },
    {
        _id: generateId(),
        title: "Task three",
        startDate: Moment().unix(),
        endDate: Moment().add(2, 'days').unix()
    },
    {
        _id: generateId(),
        title: "Task four",
        startDate: Moment().add(6, 'days').unix(),
        endDate: Moment().add(7, 'days').unix()
    },
    {
        _id: generateId(),
        title: "Task five",
        startDate: Moment().add(2, 'days').unix(),
        endDate: Moment().add(4, 'days').unix()
    }
];

let GanttChart = React.createClass({
    getInitialState() {
        return {
            taskList: {taskList},
            timeRange: [],
            searchText: "",
            searchSelect: "",
            newTaskInput: "",
            popupShow: false,
            popupTask: null
        };
    },
    componentWillMount() {
        let startDates = [];
        let endDates = [];
        let taskListObject = this.state.taskList;
        for (let task of taskListObject.taskList) {
            startDates.push(task.startDate);
            endDates.push(task.endDate);
        }
        // Filter arrays to have unique values
        let uniqueStartDates = [...new Set(startDates)];
        let uniqueEndDates = [...new Set(endDates)];

        // Get first date and last one for time range
        let rowsStartDateUnix = Math.min.apply(Math, uniqueStartDates);
        let rowsEndDateUnix = Math.max.apply(Math, uniqueEndDates);

        // Set time range array to state
        this.setState({timeRange: this.generateTimeRange(Moment.unix(rowsStartDateUnix), Moment.unix(rowsEndDateUnix))});
    },
    onSearchChange(e) {
        this.setState({searchText: e.target.value});
    },
    onChangeNewTaskInput(e) {
        this.setState({newTaskInput: e.target.value});
    },
    // Button new task
    onClickNewTask() {
        let tasks = this.state.taskList;
        tasks.taskList.push(
            {
                _id: generateId(),
                title: "Task " + Math.random().toString(12).substring(7),
                startDate: Moment().add(Math.floor(Math.random() * 3) + 1, 'days').unix(),
                endDate: Moment().add(Math.floor(Math.random() * 6) + 3, 'days').unix()
            }
        );

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
            return result;
        }
    },
    // Render popup with task details
    renderTaskPopup(rowId) {
        let tasks = this.state.taskList;
        this.setState({popupTask: tasks.taskList[rowId]});
        this.setState({popupShow: true});
    },
    closeTaskPopup() {
        this.setState({popupShow: false});
        this.setState({popupTask: null});
    },
    saveTaskData(taskObject) {
        let taskList = this.state.taskList.taskList;
        let indexOfTaskToUpdate = taskList.findIndex(task => task._id === taskObject._id);

        taskList[indexOfTaskToUpdate] = taskObject;
        this.setState({taskList: {taskList}})
        console.log(this.state.taskList)
    },
    // Generate table header for time range
    renderChartHeaderColumns() {
        let tableThStyle = {
            width: "1%",
            whiteSpace: "nowrap"
        };
        let rows = [];
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
        let taskDateColumnStyle = {
            backgroundColor: "#265A88",
            borderRight: "none",
            borderLeft: "none",
            borderRadius: "2px",
            backgroundClip: "padding-box"
        };
        let taskRowStyle = {
            cursor: "pointer"
        };
        let taskRows = [];
        let timeRange = this.state.timeRange;
        let tasksObject = this.state.taskList;
        // Generate row foreach task
        const tmpRender = function (task, index) {
            let taskDates = [];
            timeRange.forEach(function (date, index) {
                if (Moment.unix(date) >= Moment.unix(task.startDate)
                    && Moment.unix(date) <= Moment.unix(task.endDate)
                ) {
                    taskDates.push(
                        <td style={taskDateColumnStyle} key={index}>
                        </td>
                    );
                } else {
                    taskDates.push(
                        <td key={index}>
                        </td>
                    );
                }
            });

            taskRows.push(
                <tr style={taskRowStyle} key={index} onClick={this.renderTaskPopup.bind(this, index)}>
                    <td>{task.title}</td>
                    {taskDates}
                </tr>
            );
        };

        tasksObject.taskList.forEach(tmpRender.bind(this));

        return taskRows;
    },
    // Create table structure
    renderChartTable() {
        let tableThStyle = {
            width: "5%",
            whiteSpace: "nowrap"
        };
        return (
            <table className="table table-bordered table-hover table-striped">
                <thead>
                <tr>
                    <th style={tableThStyle}>
                        Tasks
                    </th>
                    {this.renderChartHeaderColumns()}
                </tr>
                </thead>
                <tbody>
                {this.renderTaskRows()}
                </tbody>
            </table>
        );
    },
    render() {
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
            marginTop: "30px"
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
                <div className="row">
                    <div style={tableDivStyle} className="col-sm-12">
                        {this.renderChartTable()}
                    </div>
                </div>
                <TaskPopup popupTask={this.state.popupTask}
                           popupShow={this.state.popupShow}
                           onClickClose={this.closeTaskPopup.bind(this)}
                           taskFieldsRules={this.props.taskFieldsRules}
                           saveTaskCb={this.saveTaskData}/>
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

module.exports = GanttChart;
