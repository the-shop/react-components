import React from 'react';
import ReactDOM from 'react-dom';
import GanttChart from './components/GanttChart.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    datePicker: {
        selectColor: "#265A88",
    },
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <GanttChart />
    </MuiThemeProvider>
    , document.getElementById("container")
);
