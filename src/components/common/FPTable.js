import { Component } from "react";
import { Table } from "react-bootstrap";
import info from '../../media/common/info-small.svg'


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
                                     <th key={d.key}>
                                        {d.name}
                                        {d.name === 'Balance' || d.name === 'Price' ? <img className="form__icon-info" src={info}/> : null}
                                    </th>
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