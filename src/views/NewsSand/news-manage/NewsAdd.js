import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useNavigate } from 'react-router';
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState()
  const [newsContent, setNewsContent] = useState()
  const User = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {

      if (newsContent === '' || newsContent.trim() === '<p></p>') {

        message.error('新闻内容不能为空！')
      }
      else {
        console.log(formInfo, newsContent);
        setCurrent(current + 1)
      }
    }


  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }

  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get("/categories").then(res => {
      // console.log(res.data)
      setCategoryList(res.data)
    })
  }, [])


  const handleSave = (auditState) => {

    axios.post('/news', {
      ...formInfo,
      "content": newsContent,
      "region": User.region ? User.region : "全球",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: "bottomRight",
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>


      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? '' : style.active}>

          <Form
            {...layout}
            name="basic"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input !' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input !' }]}
            >
              <Select>
                {
                  categoryList.map(item =>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>

        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => { setNewsContent(value) }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>

      </div>
      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
