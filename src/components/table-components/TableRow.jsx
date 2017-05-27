import React from 'react';

let TableRow = React.createClass({
   render() {
       return (
         <tr key={this.props.keyProp}>
             {this.props.children}
         </tr>
       );
   }
});

TableRow.PropTypes = {
    keyProp: React.PropTypes.string
};

export default TableRow;
