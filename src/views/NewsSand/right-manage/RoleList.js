import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList() {
  useEffect(() => {
    axios.get('/roles').then((res) => {
      // console.log(res.data);
      setDataSource(res.data)
    })
  }, [])
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 树形控件的状态
  const [treeData, setTreeData] = useState([]);
  // 从后端拿到树形控件的状态
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      // console.log(res.data);
      setTreeData(res.data)
    })
  }, [])

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };


  const onCheck = (checkKeys) => {
    // console.log(checkKeys);
    setcurrentRights(checkKeys)
  }
  const handleOk = () => {
    console.log(currentRights, currentId)
    setIsModalVisible(false)
    //同步datasource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //patch

    // axios.patch(`http://localhost:5000/roles/${currentId}`,{
    //     rights:currentRights
    // })
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (key) => {
        // 字体加粗
        return <b>{key}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalVisible(true);
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }} />
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
              checkable
              onExpand={onExpand}
              checkedKeys={currentRights}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Modal>
        </div>
      }
    },
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });

  }
  //删除
  const deleteMethod = (item) => {
    // 当前页面同步状态 
    setDataSource(dataSource.filter(data => data.id !== item.id))
    // 后端删除
    axios.delete(`/roles/${item.id}`)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
    </div>
  )
}
