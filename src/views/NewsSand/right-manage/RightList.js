import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      // 处理首页的树形问题
      const list = res.data
      list.forEach(item => {
        if (!item.children.length) {
          item.children = ""
        }
      });
      setDataSource(res.data)
    })
  }, [])
  // confirm
  const showConfirm = (item) => {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 删除
        deleteItem(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 删除函数
  const deleteItem = (item) => {
    console.log(item);
    if (item.grade === 1) {
      // 前端删除
      setDataSource(dataSource.filter(data => data.id !== item.id))
      // 后端删除
      // axios.delete(`/rights/${item.id}`)
    }
    else {
      const list = dataSource.filter((data) => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource])
      // 后端删除
      // axios.delete(`http://localhost:5000/children/${item.id}`)
    }
    // 前端删除
    setDataSource(dataSource.filter(data => data.id !== item.id))
    // 后端删除
    // axios.delete(`/rights/${item.id}`)
  }
  // table的列
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'age',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="green">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape='circle' icon={<EditOutlined />} />
          <Button type="primary" shape='circle' danger icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)}
          />
        </div>
      }
    },
  ];

  return (
    <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
  )
}
