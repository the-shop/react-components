import React from 'react';

let TaskTitleTd = React.createClass({
   render() {
       return (
         <td>
             {this.props.title}
         </td>
       );
   }
});

TaskTitleTd.PropTypes = {
  title: React.PropTypes.string
};

export default TaskTitleTd;
