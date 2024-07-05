import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Tree } from 'antd'

import { setFilter } from '../Actions/Actions'

import './CheckBox.css'

const treeData = [
    {
        title: 'Все',
        key: '0-0-0',
    },
    {
        title: 'без пересадки',
        key: '0',
    },
    {
        title: '1 пересадка',
        key: '1',
    },
    {
        title: '2 пересадки',
        key: '2',
    },
    {
        title: '3 пересадки',
        key: '3',
    },
]
const CheckBox = (props) => {
    const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-0'])
    const [checkedKeys, setCheckedKeys] = useState([])
    const [autoExpandParent, setAutoExpandParent] = useState(true)

    const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue)
        setExpandedKeys(expandedKeysValue)
        setAutoExpandParent(false)
    }
    const onCheck = (checkedKeysValue, { node }) => {
        const isCheckingAll = node.key === '0-0-0' && !checkedKeys.includes('0-0-0')
        const isUncheckingAll = node.key === '0-0-0' && checkedKeys.includes('0-0-0')
        const allKeys = treeData.map((item) => item.key).filter((key) => key !== '0-0-0')

        let newCheckedKeys

        if (isCheckingAll) {
            newCheckedKeys = [...allKeys, '0-0-0']
        } else if (isUncheckingAll) {
            newCheckedKeys = []
        } else {
            newCheckedKeys = checkedKeysValue
            const isAllChecked = allKeys.every((key) => newCheckedKeys.includes(key))
            if (isAllChecked) {
                newCheckedKeys = [...newCheckedKeys, '0-0-0']
            } else {
                newCheckedKeys = newCheckedKeys.filter((key) => key !== '0-0-0')
            }
        }
        const filterValues = newCheckedKeys.filter((key) => key !== '0-0-0').map((key) => key[key.length - 1])
        setCheckedKeys(newCheckedKeys)
        props.onFilterChange(filterValues)
    }

    return (
        <div className="checkBox_color">
            <span>Количество пересадок</span>
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={treeData}
            />
        </div>
    )
}
const mapStateToProps = (state) => ({
    filters: state.filters,
})

const mapDispatchToProps = (dispatch) => ({
    onFilterChange: (filter) => dispatch(setFilter(filter)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckBox)
