let React = require('react');
let Moment = require('moment');

date = Moment();

let taskList = [
    {
        title: "Task One",
        startDate: date.unix(),
        endDate: date.add(5, 'days').unix()
    },
    {
        title: "Task two",
        startDate: date.add(3, 'days').unix(),
        endDate: date.add(10, 'days').unix()
    }
];

let GanttChart = React.createClass({
    getInitialState() {
        return {searchText: "", searchSelect: "", newTaskInput: ""};
    },
    onSearchChange(e) {
        this.setState({searchText: e.target.value});
    },
    onChangeNewTaskInput(e) {
        this.setState({newTaskInput: e.target.value});
    },
    // Button new task
    onClickNewTask() {

    },
    // Select display type, chart or list
    onSelectDisplayType() {

    },
    renderChartHeadRows(taskList) {
        let startDates = [];
        let endDates = [];
        for (let task of taskList) {
            startDates.push(task.startDate);
            endDates.push(task.endDate);
        }
        let uniqueStartDates = [...new Set(startDates)];
        let uniqueEndDates = [...new Set(endDates)];

        let rowsStartDateUnix = Math.min.apply(Math, uniqueStartDates);
        let rowsEndDateUnix = Math.min.apply(Math, uniqueEndDates);

        // Recursive function to generate time range between two Moment objects
        function generateTimeRange(momentStartDate, momentEndDate, result = []) {
            if (momentStartDate.isBefore(momentEndDate)) {
                result.push(momentStartDate.unix());
                momentStartDate.add(1, 'day');
                return generateTimeRange(momentStartDate, momentEndDate, result);
            } else {
                return result;
            }
        }

        let timeRangeArray = generateTimeRange(Moment.unix(rowsStartDateUnix), Moment.unix(rowsEndDateUnix));
        let rows = [];

        // Generate table header element foreach date
        timeRangeArray.forEach(function (date, index) {
            rows.push(
                <th key={index}>
                    {Moment.unix(date).format('DD MMM YYYY')}
                </th>
            );
        });

        return rows;
    },
    // Create table structure
    renderChartTable() {
        console.log();
        let tableStyle = {
            width: "max"
        };
        return (
            <table className="table table-bordered table-hover table-striped">
                <thead>
                <tr>
                    <th>
                        Tasks
                    </th>
                    {this.renderChartHeadRows(taskList)}
                </tr>
                </thead>
                <tbody>
                <tr key="1">
                    <td>
                        Task One
                    </td>
                </tr>
                <tr key="2">
                    <td>
                        Task Two
                    </td>
                </tr>
                <tr key="3">
                    <td>
                        Task Three
                    </td>
                </tr>
                <tr key="4">
                    <td>
                        Task Four
                    </td>
                </tr>
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
            </div>
        );
    }
});

module.exports = GanttChart;
