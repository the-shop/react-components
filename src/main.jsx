import React from 'react';
import ReactDOM from 'react-dom';
import GanttChart from './components/GanttChart.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <GanttChart />
    </MuiThemeProvider>
    , document.getElementById("container")
);
