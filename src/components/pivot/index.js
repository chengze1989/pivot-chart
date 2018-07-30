import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.js'
import { transTree } from './utils/antTree.js'

let columns = [{
  title: 'Dimension',
  dataIndex: 'dimension',
  key: 'dimension',
}];

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

class PivotTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            antTree: [],
            columns: columns
        }
    }
    componentWillReceiveProps (nextProps) {
        const { dataSource, aggFunc, Dimensions, Measures } = nextProps
        this.dataset = new DataSet({
            FACT_TABLE: dataSource,
            DIMENSIONS: Dimensions,
            MEASURES: Measures,
            aggFunc: aggFunc
        })

        this.dataset.buildTree()
        console.log('build finish')
        this.dataset.aggTree()
        console.log('agg fisish')
        let tree = transTree(this.dataset.tree)
        console.log('trans finish')
        let newColumns = Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea
              }
        })
        this.setState({
            // antTree: [...tree[0]._children],
            antTree: tree,
            columns: columns.concat(newColumns)
        })

    }
    expandHandler = (expanded, record) => {
        const { Measures } = this.props
        console.log(expanded, record)
        record._hide = !expanded
        let newColumns = Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea
              }
        })
        this.setState({
            columns: columns.concat(newColumns)
        })
    }
    render () {
        console.log(this.state.antTree)
        return (<Table 
            defaultExpandAllRows={true}
            bordered={true}
            pagination={{
                defaultPageSize: 20
            }}
            columns={this.state.columns} 
            rowSelection={rowSelection} 
            onExpand={this.expandHandler}
            dataSource={this.state.antTree} />)
    }
}

export default PivotTable;