import React from 'react'
import axios from 'axios'
import { useEffect, useState, useRef, useContext } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function NewsCategory() {
  useEffect(() => {
    axios.get('/categories').then((res) => {
      setDataSource(res.data)
    })
  }, [])
  const [dataSource, setDataSource] = useState([])
  const EditableContext = React.createContext(null);
  const handleSave = (record) => {
    setDataSource(dataSource.map(
      item => {
        if (item.id === record.id) {
          return {
            title: record.title,
            id: item.id,
            value: record.value
          }
        }
        return item
      }
    ))
    // console.log(record);
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.value
    })
  }
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
        </div>
      }
    },
  ]
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };
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
    axios.delete(`/categories/${item.id}`)
  }
  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
    </div>
  )
}
