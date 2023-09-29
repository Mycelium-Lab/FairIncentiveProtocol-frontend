import { Component } from "react";
import { Table } from "react-bootstrap";


class FPTable extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {data, children} = this.props
        return (
                <Table responsive="sm">
                    { data ? 
                         <thead className="table__head">
                         <tr>
                             {
                                 data.map(d => (
                                     <th key={d.key}>{d.name}</th>
                                 ))
                             }
                         </tr>
                         </thead>
                         : null
                    }
                <tbody className="table__body">
                    {children}
                </tbody>
                </Table>
        )
    }
}

export default FPTable